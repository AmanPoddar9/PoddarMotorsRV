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

    console.log(`\n--- Deep Search for 'Aman' ---`);
    const amans = await Customer.find({ name: /Aman/i });
    console.log(`Found ${amans.length} profiles with name 'Aman':`);
    amans.forEach(c => {
        console.log(` - ID: ${c._id}, Mobile: '${c.mobile}', Name: '${c.name}', Pwd: ${!!c.passwordHash}, Created: ${c.createdAt}`);
    });

    console.log(`\n--- Deep Search for Mobile '8873' ---`);
    // Regex search
    const mobiles = await Customer.find({ mobile: { $regex: '8873', $options: 'i' } });
    console.log(`Found ${mobiles.length} profiles with mobile containing '8873':`);
    mobiles.forEach(c => {
        console.log(` - ID: ${c._id}, Mobile: '${c.mobile}', Name: '${c.name}'`);
    });

    process.exit();
};

debugUser();
