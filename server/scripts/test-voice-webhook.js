const axios = require('axios');

const payload = {
  conversation_id: "test-sim-001",
  metadata: {
    caller_id: "+919999999999" // Replace with your verified sandbox number to receive actual msg
  },
  analysis: {
    evaluation_criteria_results: {
        appointment_requested: "success",
        high_intent: "true"
    },
    transcript_summary: "Customer wants to book a general service for their Swift Dzire."
  }
};

async function runTest() {
  try {
    console.log('🚀 Sending Test Webhook to Local Server...');
    const res = await axios.post('http://localhost:5000/api/elevenlabs/webhook', payload);
    console.log('✅ Response:', res.status, res.data);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
        console.error('❌ Error: Server is not running at http://localhost:5000');
        console.log('👉 Please start your backend server using `npm run dev` or `node index.js`');
    } else {
        console.error('❌ Error:', err.message);
    }
  }
}

runTest();
