// Ensure we load env from the server root
const path = require('path');
const envPath = path.join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
console.log('CWD:', process.cwd());
const result = require('dotenv').config({ path: envPath });
if (result.error) {
    console.log('Dotenv Error:', result.error);
}

const mongoose = require('mongoose');
const { checkAndSendReminders } = require('../schedulers/insuranceScheduler');

const runTest = async () => {
    try {
        console.log('Connecting to MONGO...');
        console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'Exists' : 'Missing'}`);
        console.log(`WHATSAPP_TOKEN: ${process.env.WHATSAPP_TOKEN ? 'Exists' : 'Missing'}`);
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Optional: Create a dummy policy expiring in exactly 7 days for testing
        // const InsurancePolicy = require('../models/InsurancePolicy');
        // const Customer = require('../models/Customer');
        
        // ... creation logic if needed ...

        await checkAndSendReminders();
        
        console.log('Test Complete');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

runTest();
