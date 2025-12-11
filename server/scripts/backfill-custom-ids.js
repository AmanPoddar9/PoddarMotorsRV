const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const generateId = (sequence) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    // Use a specific year or "Old" marker? sticking to current year is fine for backfill unless specified.
    // Let's use 24 or current year.
    const prefix = `PM-${year}-`; 
    const sequenceStr = sequence.toString().padStart(5, '0');
    return `${prefix}${sequenceStr}`;
};

const backfill = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const customers = await Customer.find({ customId: { $exists: false } }).sort({ createdAt: 1 });
        console.log(`Found ${customers.length} customers without Custom ID`);

        let count = 0;
        // Start sequence. Retrieve last one first?
        // Since we are backfilling, we might clash with new ones if we aren't careful.
        // But assuming this runs FIRST before system goes live.
        // Let's check max ID first.
        
        // Actually, we can just start from 1 for backfill if no IDs exist yet.
        // Or finding the max sequence from `idGenerator` logic logic is safer but that logic relies on finding "last created".
        // Let's keep it simple.
        
        let sequence = 1;
        
        // Find if any IDs exist to resume sequence
        const lastCustomer = await Customer.findOne({ customId: { $regex: /^PM-\d{2}-/ } }).sort({ customId: -1 });
        if (lastCustomer) {
            const parts = lastCustomer.customId.split('-');
            sequence = parseInt(parts[2], 10) + 1;
            console.log(`Resuming sequence from ${sequence}`);
        }

        for (const customer of customers) {
            // Check again if it has one (race condition)
            if (customer.customId) continue;

            const newId = generateId(sequence);
            customer.customId = newId;
            await customer.save();
            
            sequence++;
            count++;
            if (count % 100 === 0) console.log(`Updated ${count} customers...`);
        }

        console.log(`✅ Backfill complete. Updated ${count} customers.`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

backfill();
