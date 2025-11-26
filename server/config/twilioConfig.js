require('dotenv').config();
const twilio = require('twilio');

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

// Initialize Twilio client
let twilioClient = null;

if (accountSid && authToken && 
    accountSid !== 'your_account_sid_here' && 
    authToken !== 'your_auth_token_here' &&
    !accountSid.includes('placeholder')) {
  try {
    twilioClient = twilio(accountSid, authToken);
  } catch (error) {
    console.warn('⚠️  Failed to initialize Twilio client:', error.message);
  }
} else {
  console.warn('⚠️  Twilio credentials not configured or are placeholders. Twilio features will be disabled.');
}

// Configuration object
const twilioConfig = {
  accountSid,
  authToken,
  phoneNumber: twilioPhoneNumber,
  whatsappNumber,
  
  // Business details for messages
  businessName: process.env.BUSINESS_NAME || 'Poddar Motors RV',
  businessAddress: process.env.BUSINESS_ADDRESS || 'Your showroom address',
  businessPhone: process.env.BUSINESS_PHONE || 'Your phone number',
  websiteUrl: process.env.WEBSITE_URL || 'https://poddarmotorsrv.in',
  
  // Call forwarding number (for "Press 3 to speak to team")
  forwardingNumber: process.env.SALES_FORWARDING_NUMBER || twilioPhoneNumber,
};

// Helper function to check if Twilio is configured
const isTwilioConfigured = () => {
  return !!(accountSid && authToken && twilioPhoneNumber);
};

// Helper function to get client
const getClient = () => {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Please check your credentials.');
  }
  return twilioClient;
};

module.exports = {
  twilioClient,
  twilioConfig,
  isTwilioConfigured,
  getClient,
};
