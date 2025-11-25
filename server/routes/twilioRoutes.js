const express = require('express');
const router = express.Router();
const {
  handleIncomingCall,
  handleIvrResponse,
  sendSms,
  sendWhatsApp,
  handleMessageStatus,
  getCallLogs,
  getCallAnalytics,
  updateCallLog,
} = require('../controllers/twilioController');
const MessageTemplate = require('../models/MessageTemplate');

// Twilio webhooks (these will be called by Twilio service)
router.post('/voice', handleIncomingCall);
router.post('/ivr-response', handleIvrResponse);
router.post('/message-status', handleMessageStatus);

// API routes for admin dashboard
router.get('/call-logs', getCallLogs);
router.get('/analytics', getCallAnalytics);
router.patch('/call-logs/:id', updateCallLog);

// Manual message sending (for testing or manual use)
router.post('/send-sms', async (req, res) => {
  try {
    const { to, serviceType } = req.body;
    const result = await sendSms(to, serviceType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/send-whatsapp', async (req, res) => {
  try {
    const { to, serviceType } = req.body;
    const result = await sendWhatsApp(to, serviceType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Message template management
router.get('/templates', async (req, res) => {
  try {
    const templates = await MessageTemplate.find();
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/templates/:id', async (req, res) => {
  try {
    const template = await MessageTemplate.findById(req.params.id);
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/templates', async (req, res) => {
  try {
    const template = await MessageTemplate.create(req.body);
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/templates/:id', async (req, res) => {
  try {
    const template = await MessageTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/templates/:id', async (req, res) => {
  try {
    await MessageTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
