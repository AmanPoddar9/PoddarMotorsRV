const twilio = require('twilio');
const { VoiceResponse } = twilio.twiml;
const { getClient, twilioConfig, isTwilioConfigured } = require('../config/twilioConfig');
const CallLog = require('../models/CallLog');
const MessageTemplate = require('../models/MessageTemplate');

/**
 * Handle incoming voice call - Initial IVR greeting
 */
const handleIncomingCall = async (req, res) => {
  try {
    const { From, To, CallSid } = req.body;

    // Log the call
    await CallLog.create({
      callSid: CallSid,
      from: From,
      to: To,
      callStatus: 'in-progress',
    });

    // Generate TwiML response
    const twiml = new VoiceResponse();
    
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/twilio/ivr-response',
      method: 'POST',
      timeout: 10,
    });

    gather.say(
      {
        voice: 'Polly.Aditi',
        language: 'en-IN',
      },
      `Welcome to ${twilioConfig.businessName}! ` +
      'Press 1 for car buying inquiries. ' +
      'Press 2 for workshop services. ' +
      'Press 3 to speak with our sales team.'
    );

    // If no input received
    twiml.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'We did not receive your input. Please call again. Thank you!'
    );

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling incoming call:', error);
    const twiml = new VoiceResponse();
    twiml.say('We are experiencing technical difficulties. Please try again later.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
};

/**
 * Handle IVR response (keypress)
 */
const handleIvrResponse = async (req, res) => {
  try {
    const { Digits, From, CallSid } = req.body;
    const twiml = new VoiceResponse();

    let serviceType = 'unknown';
    let shouldSendMessages = false;

    // Update call log with IVR selection
    await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      { ivrSelection: Digits || 'none' }
    );

    switch (Digits) {
      case '1':
        // Car buying
        serviceType = 'car-buying';
        shouldSendMessages = true;
        twiml.say(
          { voice: 'Polly.Aditi', language: 'en-IN' },
          'Thank you for your interest in buying a car! We are sending you our latest inventory details via SMS and WhatsApp. Have a great day!'
        );
        break;

      case '2':
        // Workshop services
        serviceType = 'workshop';
        shouldSendMessages = true;
        twiml.say(
          { voice: 'Polly.Aditi', language: 'en-IN' },
          'Thank you for choosing our workshop services! We are sending you service details and booking information via SMS and WhatsApp. Thank you!'
        );
        break;

      case '3':
        // Forward to sales team
        serviceType = 'speak-to-team';
        twiml.say(
          { voice: 'Polly.Aditi', language: 'en-IN' },
          'Please hold while we connect you to our sales team.'
        );
        twiml.dial({
          callerId: twilioConfig.phoneNumber,
        }, twilioConfig.forwardingNumber);
        
        await CallLog.findOneAndUpdate(
          { callSid: CallSid },
          { forwardedToSales: true, serviceType }
        );
        break;

      default:
        twiml.say(
          { voice: 'Polly.Aditi', language: 'en-IN' },
          'Invalid selection. Please call again and choose a valid option. Thank you!'
        );
    }

    // Update service type
    if (serviceType !== 'unknown') {
      await CallLog.findOneAndUpdate(
        { callSid: CallSid },
        { serviceType }
      );
    }

    // Send messages asynchronously (don't wait for completion)
    if (shouldSendMessages) {
      setImmediate(() => {
        sendMessagesToCustomer(From, serviceType, CallSid);
      });
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling IVR response:', error);
    const twiml = new VoiceResponse();
    twiml.say('An error occurred. Please try again later.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
};

/**
 * Send SMS and WhatsApp messages to customer
 */
const sendMessagesToCustomer = async (customerNumber, serviceType, callSid) => {
  try {
    // Send SMS
    await sendSms(customerNumber, serviceType, callSid);
    
    // Send WhatsApp (if configured)
    if (twilioConfig.whatsappNumber) {
      await sendWhatsApp(customerNumber, serviceType, callSid);
    }
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};

/**
 * Send SMS message
 */
const sendSms = async (to, serviceType, callSid = null) => {
  try {
    if (!isTwilioConfigured()) {
      throw new Error('Twilio is not configured');
    }

    const client = getClient();

    // Get template from database
    let template = await MessageTemplate.findOne({
      type: 'sms',
      serviceType,
      active: true,
    });

    // If no template found, use default
    let messageBody;
    if (template) {
      messageBody = replaceTemplateVariables(template.content);
    } else {
      messageBody = getDefaultSmsTemplate(serviceType);
    }

    // Send SMS
    const message = await client.messages.create({
      body: messageBody,
      from: twilioConfig.phoneNumber,
      to: to,
    });

    console.log(`✅ SMS sent successfully: ${message.sid}`);

    // Update call log
    if (callSid) {
      await CallLog.findOneAndUpdate(
        { callSid },
        {
          'smsStatus.sent': true,
          'smsStatus.messageSid': message.sid,
        }
      );
    }

    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    // Update call log with error
    if (callSid) {
      await CallLog.findOneAndUpdate(
        { callSid },
        {
          'smsStatus.sent': false,
          'smsStatus.error': error.message,
        }
      );
    }

    return { success: false, error: error.message };
  }
};

/**
 * Send WhatsApp message
 */
const sendWhatsApp = async (to, serviceType, callSid = null) => {
  try {
    if (!isTwilioConfigured() || !twilioConfig.whatsappNumber) {
      throw new Error('WhatsApp is not configured');
    }

    const client = getClient();

    // Get template from database
    let template = await MessageTemplate.findOne({
      type: 'whatsapp',
      serviceType,
      active: true,
    });

    // If no template found, use default
    let messageBody;
    if (template) {
      messageBody = replaceTemplateVariables(template.content);
    } else {
      messageBody = getDefaultWhatsAppTemplate(serviceType);
    }

    // Format WhatsApp number
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    // Send WhatsApp message
    const message = await client.messages.create({
      body: messageBody,
      from: twilioConfig.whatsappNumber,
      to: whatsappTo,
    });

    console.log(`✅ WhatsApp sent successfully: ${message.sid}`);

    // Update call log
    if (callSid) {
      await CallLog.findOneAndUpdate(
        { callSid },
        {
          'whatsappStatus.sent': true,
          'whatsappStatus.messageSid': message.sid,
        }
      );
    }

    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    
    // Update call log with error
    if (callSid) {
      await CallLog.findOneAndUpdate(
        { callSid },
        {
          'whatsappStatus.sent': false,
          'whatsappStatus.error': error.message,
        }
      );
    }

    return { success: false, error: error.message };
  }
};

/**
 * Handle status callbacks for SMS/WhatsApp delivery
 */
const handleMessageStatus = async (req, res) => {
  try {
    const { MessageSid, MessageStatus } = req.body;

    // Update call log based on message status
    if (MessageStatus === 'delivered') {
      await CallLog.findOneAndUpdate(
        { $or: [
          { 'smsStatus.messageSid': MessageSid },
          { 'whatsappStatus.messageSid': MessageSid }
        ]},
        {
          $set: {
            'smsStatus.delivered': true,
            'whatsappStatus.delivered': true,
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling message status:', error);
    res.sendStatus(500);
  }
};

/**
 * Get call logs with filters
 */
const getCallLogs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      serviceType,
      followUpRequired,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (serviceType) {
      query.serviceType = serviceType;
    }

    if (followUpRequired !== undefined) {
      query.followUpRequired = followUpRequired === 'true';
    }

    const logs = await CallLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await CallLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get call analytics
 */
const getCallAnalytics = async (req, res) => {
  try {
    const { period = 'today' } = req.query;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setDate(startDate.getDate() - 30);
    }

    const totalCalls = await CallLog.countDocuments({
      createdAt: { $gte: startDate },
    });

    const serviceDistribution = await CallLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
    ]);

    const smsStats = await CallLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          sent: { $sum: { $cond: ['$smsStatus.sent', 1, 0] } },
          delivered: { $sum: { $cond: ['$smsStatus.delivered', 1, 0] } },
        },
      },
    ]);

    const whatsappStats = await CallLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          sent: { $sum: { $cond: ['$whatsappStatus.sent', 1, 0] } },
          delivered: { $sum: { $cond: ['$whatsappStatus.delivered', 1, 0] } },
        },
      },
    ]);

    const hourlyDistribution = await CallLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalCalls,
        serviceDistribution,
        smsStats: smsStats[0] || { sent: 0, delivered: 0 },
        whatsappStats: whatsappStats[0] || { sent: 0, delivered: 0 },
        hourlyDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update call log (mark as contacted, add notes, etc.)
 */
const updateCallLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.contacted) {
      updates.contactedAt = new Date();
    }

    const log = await CallLog.findByIdAndUpdate(id, updates, { new: true });

    res.json({ success: true, data: log });
  } catch (error) {
    console.error('Error updating call log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Helper: Replace template variables
 */
const replaceTemplateVariables = (template) => {
  return template
    .replace(/\{businessName\}/g, twilioConfig.businessName)
    .replace(/\{address\}/g, twilioConfig.businessAddress)
    .replace(/\{phone\}/g, twilioConfig.businessPhone)
    .replace(/\{website\}/g, twilioConfig.websiteUrl);
};

/**
 * Helper: Get default SMS template
 */
const getDefaultSmsTemplate = (serviceType) => {
  if (serviceType === 'car-buying') {
    return `🚗 Thank you for calling ${twilioConfig.businessName}!\n\n` +
           `Browse our inventory: ${twilioConfig.websiteUrl}/buy\n` +
           `📍 ${twilioConfig.businessAddress}\n` +
           `📞 ${twilioConfig.businessPhone}\n\n` +
           `Visit us today for test drives!`;
  } else {
    return `🔧 Thank you for calling ${twilioConfig.businessName} Workshop!\n\n` +
           `Book service: ${twilioConfig.websiteUrl}/poddarmotors\n` +
           `📍 ${twilioConfig.businessAddress}\n` +
           `📞 ${twilioConfig.businessPhone}\n\n` +
           `We're here to help!`;
  }
};

/**
 * Helper: Get default WhatsApp template
 */
const getDefaultWhatsAppTemplate = (serviceType) => {
  if (serviceType === 'car-buying') {
    return `Hi! 👋\n\n` +
           `Thanks for your interest in ${twilioConfig.businessName}.\n\n` +
           `🚗 *Browse Our Inventory*\n${twilioConfig.websiteUrl}/buy\n\n` +
           `📍 *Visit Our Showroom*\n${twilioConfig.businessAddress}\n\n` +
           `💬 *Questions?*\nReply to this message!\n\n` +
           `Website: ${twilioConfig.websiteUrl}`;
  } else {
    return `Hi! 👋\n\n` +
           `Thanks for choosing ${twilioConfig.businessName} Workshop.\n\n` +
           `🔧 *Our Services*\nRepairs, Maintenance, Inspections\n\n` +
           `📅 *Book Online*\n${twilioConfig.websiteUrl}/poddarmotors\n\n` +
           `📍 *Location*\n${twilioConfig.businessAddress}\n\n` +
           `💬 Reply to this message for assistance!`;
  }
};

module.exports = {
  handleIncomingCall,
  handleIvrResponse,
  sendSms,
  sendWhatsApp,
  handleMessageStatus,
  getCallLogs,
  getCallAnalytics,
  updateCallLog,
};
