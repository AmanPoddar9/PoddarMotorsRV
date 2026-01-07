const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models
const User = require('../models/User');
const InsurancePolicy = require('../models/InsurancePolicy');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const backfillAgents = async () => {
    await connectDB();

    try {
        console.log('Starting backfill of assignedAgent...');

        // 1. Find Admin User
        const adminUser = await User.findOne({ email: 'admin@poddarmotors.com' });
        
        if (!adminUser) {
            console.error('Admin user (admin@poddarmotors.com) not found! Cannot backfill.');
            process.exit(1);
        }

        console.log(`Found Admin User: ${adminUser.name} (${adminUser._id})`);

        // 2. Update Policies
        const result = await InsurancePolicy.updateMany(
            { 
                $or: [
                    { assignedAgent: { $exists: false } },
                    { assignedAgent: null }
                ]
            },
            { 
                $set: { assignedAgent: adminUser._id } 
            }
        );

        console.log(`Backfill Complete.`);
        console.log(`Matched (Unassigned): ${result.matchedCount}`);
        console.log(`Modified (Updated): ${result.modifiedCount}`);

        process.exit(0);

    } catch (error) {
        console.error('Error during backfill:', error);
        process.exit(1);
    }
};

backfillAgents();
