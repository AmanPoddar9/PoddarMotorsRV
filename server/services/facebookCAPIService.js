const axios = require('axios');
const crypto = require('crypto');

// Helpers for Hashing (SHA256)
const hashData = (data) => {
    if (!data) return null;
    return crypto.createHash('sha256').update(data).digest('hex');
};

const normalizeEmail = (email) => {
    if (!email) return null;
    return email.trim().toLowerCase();
};

const normalizePhone = (phone) => {
    if (!phone) return null;
    // Remove non-numeric characters
    // Add country code '91' if missing (assuming India context for Poddar Motors)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    }
    return cleanPhone;
};

const normalizeCity = (city) => {
    if (!city) return null;
    return city.trim().toLowerCase().replace(/\s/g, '');
};

/**
 * Send Event to Meta Conversions API
 * @param {string} eventName - Standard Meta Event (Lead, Schedule, Purchase, Contact)
 * @param {Object} userData - Customer details (email, phone, ip_address, user_agent, fbc, fbp)
 * @param {Object} customData - Value, currency, content_name, etc.
 * @param {string} eventSourceUrl - The URL where the event happened
 */
const sendEvent = async (eventName, userData, customData = {}, eventSourceUrl) => {
    try {
        const PIXEL_ID = process.env.META_PIXEL_ID;
        const ACCESS_TOKEN = process.env.META_API_ACCESS_TOKEN;

        if (!PIXEL_ID || !ACCESS_TOKEN) {
            console.warn('[Meta CAPI] Skipped: Missing Credentials in .env');
            return;
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Prepare User Data (hashed)
        // Note: IP Address and User Agent do NOT need hashing
        const user_data = {
            em: userData.email ? [hashData(normalizeEmail(userData.email))] : undefined,
            ph: userData.phone ? [hashData(normalizePhone(userData.phone))] : undefined,
            client_ip_address: userData.ip_address,
            client_user_agent: userData.user_agent,
            ct: userData.city ? [hashData(normalizeCity(userData.city))] : undefined,
            country: [hashData('in')], // Defaulting to India for this specific business
        };
        
        // Include fbc / fbp cookies if available
        if (userData.fbc) user_data.fbc = userData.fbc;
        if (userData.fbp) user_data.fbp = userData.fbp;

        const eventPayload = {
            event_name: eventName,
            event_time: currentTimestamp,
            action_source: "website",
            event_source_url: eventSourceUrl || "https://www.poddarmotors.com",
            user_data: user_data,
            custom_data: customData
        };

        const payload = {
            data: [eventPayload],
            // test_event_code: 'TEST20664' // UNCOMMENT FOR TESTING IN EVENTS MANAGER
        };

        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            payload
        );

        console.log(`[Meta CAPI] Event Sent: ${eventName} | ID: ${response.data.fbtrace_id}`);
        return response.data;

    } catch (error) {
        console.error('[Meta CAPI] Error Sending Event:', error.response ? error.response.data : error.message);
        // We do not throw error to avoid blocking main thread functionality
    }
};

module.exports = { sendEvent };
