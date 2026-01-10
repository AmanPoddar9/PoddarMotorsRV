const axios = require('axios');
const crypto = require('crypto');

// Use the secret provided by the user for testing
const SECRET = 'wsec_6c760c89bd99c398ddd3cc763f2c340fd63cc23bcd8db13e599729c762706e7f';

async function simulateWebhook() {
  const payload = JSON.stringify({
    conversation_id: "conv_" + Date.now(),
    agent_id: "agent_test_123",
    status: "done",
    metadata: {
      phone_call: {
        number: "+919999988888", 
        external_number: "+919999988888"
      },
      start_time: Date.now() / 1000
    },
    analysis: {
      summary: "Customer inquired about the price of a Toyota Fortuner. Mentioned they have a budget of 15 Lakhs. (Signed Request)",
      success: true
    },
    transcript: [
      { role: "agent", message: "Hello, this is Poddar Motors." },
      { role: "user", message: "Hi, I am looking for a used Fortuner." },
      { role: "agent", message: "We have a few in stock. What is your budget?" },
      { role: "user", message: "Around 15 Lakhs." }
    ]
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${timestamp}.${payload}`;
  const hmac = crypto.createHmac('sha256', SECRET);
  const signature = hmac.update(message).digest('hex');
  
  const headerValue = `t=${timestamp},v0=${signature}`;

  try {
    console.log(`Sending signed webhook to http://localhost:4000/api/elevenlabs/webhook/transcript...`);
    
    // Note: We intentionally send the raw valid payload. 
    // In real life, ElevenLabs sends the JSON body.
    
    const response = await axios.post(
        `http://localhost:4000/api/elevenlabs/webhook/transcript`, 
        JSON.parse(payload), // Axios will verify serialization, but signature relies on exact string match if we captured raw. 
        // NOTE: Axios automatic JSON serialization might differ slightly in whitespace from our manual stringify if we are not careful.
        // However, on the server, `req.rawBody` captures what comes over the wire.
        // So as long as axios sends what we signed, it's fine. 
        // To be safe, we should probably manually serialize headers if needed, but standard JSON is usually consistent.
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
    }
  }
}

// Wait 2 seconds for server to be fully ready
setTimeout(simulateWebhook, 2000);
