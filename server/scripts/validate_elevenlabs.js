const axios = require('axios');
const crypto = require('crypto');

// Production Secret provided by user
const SECRET = 'wsec_94fd8f591b58d274e300f67c057f2e96ed61df167d42d5bc864a5780e82cdfc9'; 
const TARGET_URL = 'https://poddar-motors-rv-hkxu.vercel.app/api/elevenlabs/webhook/transcript';

async function simulateWebhook() {
  const payloadObj = {
    type: "post_call_transcription",
    event_timestamp: Math.floor(Date.now() / 1000),
    data: {
        conversation_id: "conv_" + Date.now(),
        agent_id: "agent_prod_test",
        status: "done",
        metadata: {
            phone_call: {
                number: "+919999988888", 
                external_number: "+919999988888"
            },
            start_time_unix_secs: Date.now() / 1000,
            call_duration_secs: 120
        },
        analysis: {
            transcript_summary: "Production Test: Customer asked about financing options for a Swift Dzire.",
            call_successful: "success"
        },
        transcript: [
            { role: "agent", message: "Hello, this is Poddar Motors." },
            { role: "user", message: "Hi, is this the production system?" }
        ]
    }
  };

  const payloadString = JSON.stringify(payloadObj);

  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${timestamp}.${payloadString}`;
  const hmac = crypto.createHmac('sha256', SECRET);
  const signature = hmac.update(message).digest('hex');
  
  const headerValue = `t=${timestamp},v0=${signature}`;

  try {
    console.log(`Sending signed webhook to ${TARGET_URL}...`);
    
    // We must send the exact string we signed, but axios takes an object and stringifies it.
    // To be perfectly safe with signatures, usually you send the string and content-type header manually,
    // or rely on axios stringifying it exactly the same way (usually true for simple objects).
    // Let's rely on axios for now as it worked locally.
    
    const response = await axios.post(
        TARGET_URL, 
        payloadObj, 
        {
            headers: {
                'elevenlabs-signature': headerValue,
                'Content-Type': 'application/json'
            }
        }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    
    if (response.status === 200) {
        console.log('✅ Webhook Test Passed!');
    } else {
        console.log('❌ Webhook Test Failed with status:', response.status);
    }

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    if (error.response) {
        console.error('Server responded with:', error.response.data);
        console.error('Status:', error.response.status);
    }
  }
}

simulateWebhook();
