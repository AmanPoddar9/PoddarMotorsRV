require('dotenv').config();
const { sendIntentBasedMessage } = require('../controllers/metaController');

async function testMeta() {
    // Replace with your real phone number for testing: e.g. '9190310xxxxx'
    const testNumber = process.argv[2] || '919934102222'; // Default mock or pass via CLI
    
    console.log(`🚀 Testing Meta WhatsApp to: ${testNumber}`);
    console.log('Using Template: hello_world (Forced default)');

    const result = await sendIntentBasedMessage(testNumber, 'voice-ai-sales');
    
    if (result.success) {
        console.log('✅ Success! Message sent.');
        console.log('Response ID:', result.data.messages[0].id);
    } else {
        console.log('❌ Failed.');
        console.log('Error:', result.error);
    }
}

testMeta();
