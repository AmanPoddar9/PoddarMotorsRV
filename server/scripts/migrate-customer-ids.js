const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Counter = require('../models/Counter');

// Migration Config
const TARGET_YEAR = new Date().getFullYear().toString().slice(-2); // "25"
const PREFIX = `PM-${TARGET_YEAR}-`;
const COUNTER_ID = `customer_${TARGET_YEAR}`;

async function migrateCustomerIds() {
    try {
        console.log('--- CUSTOMER ID MIGRATION ---');
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Fetch all customers sorted by Creation Date
        // We want the oldest customers to get the lowest IDs (00001, 00002...)
        const customers = await Customer.find({}).sort({ createdAt: 1 });
        console.log(`Found ${customers.length} customers to migrate.`);

        // 2. STRATEGY CHANGE: Two-Pass Migration to avoid Collision
        // Issue: If we rename Cust A to "PM-25-00007", but Cust B already has "PM-25-00007", it fails.
        // Solution: 
        // Pass 1: Rename ALL to "TEMP-{id}"
        // Pass 2: Rename ALL to "PM-25-{seq}"
        
        console.log('Phase 1: Renaming to temporary IDs to clear namespace...');
        const tempUpdates = customers.map(c => ({
            updateOne: {
                filter: { _id: c._id },
                update: { $set: { customId: `TEMP-${c._id}` } }
            }
        }));
        
        if (tempUpdates.length > 0) {
            await Customer.bulkWrite(tempUpdates);
            console.log('✅ Phase 1 Complete: All IDs set to TEMP.');
        }

        console.log('Phase 2: Assigning new sequential IDs...');
        const finalUpdates = [];
        let seq = 1;
        
        // Refetch to be safe? No, order is preserved from first fetch as long as we iterate 'customers' array
        customers.forEach(async (customer) => {
            const newId = `${PREFIX}${seq.toString().padStart(5, '0')}`;
            finalUpdates.push({
                updateOne: {
                    filter: { _id: customer._id },
                    update: { $set: { customId: newId } }
                }
            });
            seq++;
        });

        if (finalUpdates.length > 0) {
            const result = await Customer.bulkWrite(finalUpdates);
            console.log('✅ Phase 2 Complete:');
            console.log(`   Modified: ${result.modifiedCount}`);
        }

        // 4. Update the Atomic Counter
        // The counter should point to the LAST used sequence (e.g. if we have 618 customers, seq should be 618)
        // because the generator does $inc: 1, so next will be 619.
        const lastSeq = customers.length;
        
        await Counter.findOneAndUpdate(
            { _id: COUNTER_ID },
            { $set: { seq: lastSeq } },
            { upsert: true, new: true }
        );

        console.log(`✅ ID Counter updated to sequence: ${lastSeq}`);
        console.log(`   Next ID generated will be: ${PREFIX}${(lastSeq + 1).toString().padStart(5, '0')}`);

    } catch (err) {
        console.error('Migration Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrateCustomerIds();
