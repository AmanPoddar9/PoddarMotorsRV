const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

async function analyzeDuplicates() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const customers = await Customer.find({}).select('name mobile email customId');
        console.log(`Total Customers: ${customers.length}`);

        const mobileMap = new Map();
        const emailMap = new Map();
        const duplicates = {
            mobile: [],
            email: []
        };

        let malformedMobiles = 0;

        customers.forEach(c => {
            // Analyze Mobile
            if (c.mobile) {
                // Normalize: remove non-digits, take last 10
                const clean = c.mobile.replace(/\D/g, '').slice(-10);
                if (clean.length < 10) {
                    malformedMobiles++;
                } else {
                    if (mobileMap.has(clean)) {
                        duplicates.mobile.push({
                            original: mobileMap.get(clean),
                            duplicate: { name: c.name, mobile: c.mobile, id: c._id }
                        });
                    } else {
                        mobileMap.set(clean, { name: c.name, mobile: c.mobile, id: c._id });
                    }
                }
            }

            // Analyze Email
            if (c.email) {
                const clean = c.email.toLowerCase().trim();
                if (emailMap.has(clean)) {
                    duplicates.email.push({
                        original: emailMap.get(clean),
                        duplicate: { name: c.name, email: c.email, id: c._id }
                    });
                } else {
                    emailMap.set(clean, { name: c.name, email: c.email, id: c._id });
                }
            }
        });

        console.log('\n--- ANALYSIS REPORT ---');
        console.log(`Malformed Mobile Numbers (digits < 10): ${malformedMobiles}`);
        console.log(`Potential Mobile Duplicates (Norm 10-digit): ${duplicates.mobile.length}`);
        duplicates.mobile.forEach(d => {
            console.log(`  Conflict: ${d.original.mobile} (${d.original.name}) vs ${d.duplicate.mobile} (${d.duplicate.name})`);
        });

        console.log(`\nPotential Email Duplicates (Case insensitive): ${duplicates.email.length}`);
        duplicates.email.forEach(d => {
            console.log(`  Conflict: ${d.original.email} (${d.original.name}) vs ${d.duplicate.email} (${d.duplicate.name})`);
        });

        if (duplicates.mobile.length === 0 && duplicates.email.length === 0) {
            console.log('\n✅ No hidden duplicates found based on normalization!');
        } else {
            console.log('\n⚠️  Hidden duplicates DETECTED. The current strict unique check is insufficient.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

analyzeDuplicates();
