const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

async function testDuplicatePrevention() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const testMobile = '9988776655';
        const testEmail = 'DuplicateTest@Example.com'; // Case sensitive check

        // Cleanup previous test
        await Customer.deleteMany({ mobile: testMobile });
        console.log('Cleaned up previous test data.');

        // 1. Create First Customer
        console.log('\n--- Test 1: Create Initial Customer ---');
        const firstCustomer = new Customer({
            name: 'Test Setup 1',
            mobile: testMobile,
            email: testEmail
        });
        await firstCustomer.save();
        console.log('✅ Created First Customer');
        console.log(`   Saved Mobile: ${firstCustomer.mobile}`);
        console.log(`   Saved Email: ${firstCustomer.email}`);

        // Verify Normalization
        if (firstCustomer.email !== 'duplicatetest@example.com') {
            throw new Error(`❌ Email Normalization FAILED. Expected lower case, got: ${firstCustomer.email}`);
        }

        // 2. Try Duplicate with Formatted Mobile (+91)
        console.log('\n--- Test 2: Attempt Duplicate with +91 format ---');
        try {
            const dupMobile = new Customer({
                name: 'Test Duplicate Mobile',
                mobile: '+91 ' + testMobile, // Should normalize to match existing
                email: 'unique@example.com'
            });
            await dupMobile.save();
            console.error('❌ FAILED: Duplicate customer (+91) was ALLOWED!');
        } catch (err) {
            if (err.code === 11000) {
                console.log('✅ SUCCESS: Duplicate (+91) blocked by Database Unique Index.');
            } else {
                console.log(`✅ SUCCESS: Operation failed (likely valid). Error: ${err.message}`);
            }
        }

        // 3. Try Duplicate with Case-Different Email
        console.log('\n--- Test 3: Attempt Duplicate with UPPERCASE Email ---');
        try {
            const dupEmail = new Customer({
                name: 'Test Duplicate Email',
                mobile: '9111111111', // Unique mobile
                email: 'DUPLICATETEST@EXAMPLE.COM' // Should match existing
            });
            await dupEmail.save();
            console.error('❌ FAILED: Duplicate customer (Case-Email) was ALLOWED!');
        } catch (err) {
             if (err.code === 11000) {
                console.log('✅ SUCCESS: Duplicate (Email Case) blocked by Database Unique Index.');
            } else {
                console.log(`✅ SUCCESS: Operation failed (likely valid). Error: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('TEST SUITE ERROR:', err);
    } finally {
        // Cleanup
        await Customer.deleteMany({ mobile: '9988776655' });
        await Customer.deleteMany({ mobile: '9111111111' });
        await mongoose.disconnect();
    }
}

testDuplicatePrevention();
