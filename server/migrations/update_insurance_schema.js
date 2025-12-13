require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const InsurancePolicy = require('../models/InsurancePolicy');

// DB Connection
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/poddar_motors';

async function migrate() {
    try {
        console.log('Connecting to DB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const policies = await InsurancePolicy.find({});
        console.log(`Found ${policies.length} policies to check.`);

        let updated = 0;
        for (const p of policies) {
            let needsSave = false;
            
            // 1. Set Defaults
            if (!p.renewalStage) {
                p.renewalStage = 'New';
                needsSave = true;
            }
            if (!p.paymentStatus) {
                p.paymentStatus = 'NotInitiated';
                needsSave = true;
            }
            if (!p.docsStatus) {
                p.docsStatus = 'NotRequested';
                needsSave = true;
            }
            if (!p.dataQuality) {
                // Check if date is valid
                if (p.policyEndDate && !isNaN(new Date(p.policyEndDate).getTime())) {
                    p.dataQuality = 'OK';
                } else {
                    p.dataQuality = 'InvalidEndDate';
                    p.policyEndDate = null; // Clear invalid date to ensure bucket logic works
                }
                needsSave = true;
            }

            if (needsSave) {
                await p.save();
                updated++;
            }
        }

        console.log(`Migration Complete. Updated ${updated} documents.`);

    } catch (e) {
        console.error('Migration Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
