const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Explicit absolute path relative to script
const mongoose = require('mongoose');
const { findPotentialMatches } = require('../utils/customerMatcher');
const Customer = require('../models/Customer');

async function testMatcher() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Clean up previous test data if any specific ones exist?
        // No, let's just create a test customer and try to match it.

        const testMobile = '9999999999';
        const testReg = 'TEST-01-AA-1111';

        // 1. Create Baseline Customer
        await Customer.deleteOne({ mobile: testMobile }); // Cleanup
        const c1 = await Customer.create({
            name: 'Test Setup Customer',
            mobile: testMobile,
            email: 'test@example.com',
            vehicles: [{ regNumber: testReg }]
        });
        console.log('Created Baseline Customer:', c1._id);

        // 2. Test Exact Mobile Match
        console.log('--- Testing Mobile Match ---');
        const matches1 = await findPotentialMatches({ mobile: testMobile });
        console.log('Matches Found:', matches1.length);
        if (matches1.length === 1 && matches1[0]._id.equals(c1._id)) {
            console.log('PASS: Exact Mobile Match');
        } else {
            console.log('FAIL: Mobile Match');
        }

        // 3. Test Vehicle Reg Match (Different Mobile)
        console.log('--- Testing Reg Match ---');
        const matches2 = await findPotentialMatches({ mobile: '8888888888', vehicleReg: testReg });
        console.log('Matches Found:', matches2.length);
        if (matches2.length === 1 && matches2[0]._id.equals(c1._id)) {
            console.log('PASS: Vehicle Reg Match');
        } else {
             console.log('FAIL: Vehicle Reg Match');
        }

        // 4. Test No Match
        console.log('--- Testing No Match ---');
        const matches3 = await findPotentialMatches({ mobile: '1111111111', vehicleReg: 'NEW-REG' });
        console.log('Matches Found:', matches3.length);
        if (matches3.length === 0) {
             console.log('PASS: No Match');
        } else {
             console.log('FAIL: No Match');
        }

        // Cleanup
        await Customer.deleteOne({ _id: c1._id });
        console.log('Cleanup Done');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

testMatcher();
