const axios = require('axios');

// Environment variables
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_VERSION = 'v19.0'; // Updated to recent version

/**
 * Send a WhatsApp Message via Meta Cloud API
 * @param {string} to - The recipient's phone number (with country code, no +)
 * @param {string} templateName - The name of the template to send
 * @param {string} languageCode - Language code (default 'en_US')
 * @param {Array} components - Template components (header, body variables)
 */
const sendWhatsAppMessage = async (to, templateName, languageCode = 'en_US', components = []) => {
    try {
        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
            console.warn('[Meta API] WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set. Message skipped.');
            return { success: false, error: 'Configuration missing' };
        }

        const url = `https://graph.facebook.com/${WHATSAPP_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
            }
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`[Meta API] Message sent to ${to}. ID: ${response.data.messages[0].id}`);
        return { success: true, data: response.data };

    } catch (error) {
        console.error('[Meta API] Failed to send message:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
};

/**
 * Send a specific template based on Intent
 * Wrapper to handle specific business logic/parameters
 */
const sendIntentBasedMessage = async (mobile, intent) => {
    // Basic cleaning of mobile number (remove +, spaces)
    // Meta requires country code without +. Assuming +91 input or 10 digit input.
    // If 10 digit, prepend 91 for India.
    let cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length === 10) cleanMobile = '91' + cleanMobile;

    let templateName = 'hello_world'; // Default safe template
    let components = [];

    // MAPPING: Intent -> Template Name
    // NOTE: These templates MUST be created and approved in Meta Business Manager first.
    // We default to 'hello_world' until you create them.
    
    switch (intent) {
        case 'voice-ai-service':
            // template: workshop_booking_v1
            // variables: none or {{1}}=name
            templateName = 'workshop_booking_v1'; 
            // Fallback to hello_world if you haven't created this yet
            // templateName = 'hello_world'; 
            break;
            
        case 'voice-ai-sales':
            // template: sales_inventory_intro
            templateName = 'sales_inventory_intro';
            // templateName = 'hello_world'; 
            break;
            
        case 'voice-ai-general':
            // template: general_welcome_save_number
            templateName = 'general_welcome_save_number';
            // templateName = 'hello_world'; 
            break;
            
        default:
            templateName = 'hello_world';
    }

    // For now, FORCE 'hello_world' because custom templates likely don't exist yet.
    // TODO: changing this line once templates are approved.
    templateName = 'hello_world'; 

    console.log(`[Meta API] Sending template '${templateName}' for intent '${intent}' to ${cleanMobile}`);
    return await sendWhatsAppMessage(cleanMobile, templateName);
};

module.exports = {
    sendWhatsAppMessage,
    sendIntentBasedMessage
};
