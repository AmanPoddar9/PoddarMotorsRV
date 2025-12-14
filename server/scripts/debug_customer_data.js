const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Customer = require('../models/Customer');
const InsurancePolicy = require('../models/InsurancePolicy');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const debugUser = async () => {
    await connectDB();

    const targetMobile = '8873002702'; // The user's mobile from screenshot

    console.log(`\n--- Searching for Customers with mobile ${targetMobile} ---`);
    // Search exact
    const exactMatches = await Customer.find({ mobile: targetMobile });
    console.log(`Exact Matches found: ${exactMatches.length}`);
    exactMatches.forEach(c => {
        console.log(`ID: ${c._id}, Name: ${c.name}, Mobile: '${c.mobile}', HasPassword: ${!!c.passwordHash}`);
    });

    // Search fuzzy (last 10 digits) to catch +91 issues
    const allCustomers = await Customer.find({});
    const fuzzyMatches = allCustomers.filter(c => c.mobile && c.mobile.toString().includes(targetMobile) && c.mobile !== targetMobile);
    
    if (fuzzyMatches.length > 0) {
        console.log(`\n--- Fuzzy Matches (Potential duplicates with different formats) ---`);
        fuzzyMatches.forEach(c => {
            console.log(`ID: ${c._id}, Name: ${c.name}, Mobile: '${c.mobile}', HasPassword: ${!!c.passwordHash}`);
        });
    }

    // Mimic Controller Logic
    console.log(`\n--- Controller Simulation ---`);
    const mobile = targetMobile;
    const linkedCustomerDocs = await Customer.find({ mobile }).select('_id');
    const linkedCustomerIds = linkedCustomerDocs.map(c => c._id);
    console.log(`Linked IDs:`, linkedCustomerIds);

    const policies = await InsurancePolicy.find({ customer: { $in: linkedCustomerIds } }).sort({ policyEndDate: -1 });
    console.log(`Found ${policies.length} policies.`);
    
    process.exit();
};

debugUser();
