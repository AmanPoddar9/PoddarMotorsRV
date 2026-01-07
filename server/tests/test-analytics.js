const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { ObjectId } = mongoose.Types;

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models
const User = require('../models/User');
const InsurancePolicy = require('../models/InsurancePolicy');
const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const runTest = async () => {
    await connectDB();

    console.log('--- STARTING ANALYTICS TEST ---');

    const testEmail = 'test007@example.com';
    // CLEANUP OLD DATA FIRST
    await User.deleteMany({ email: testEmail });
    await Customer.deleteMany({ mobile: '9999999999' });

    // 1. Create Dummy Agent
    const testAgentId = new ObjectId();
    // Use collection.insertOne to bypass Mongoose strict schema (field stripping) 
    // because User model doesn't have 'username' but DB index requires it.
    await User.collection.insertOne({
        _id: testAgentId,
        name: 'Test Agent 007',
        email: testEmail,
        username: 'testagent007', // Unique username
        role: 'insurance_agent',
        passwordHash: 'dummyhash123',
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
    });
    
    // Construct local object for test reference (mocking the mongoose doc)
    const testAgent = { 
        _id: testAgentId, 
        name: 'Test Agent 007' 
    };
    console.log('1. Created Test Agent:', testAgent.name);

    // 2. Create Dummy Customer
    const customer = await Customer.create({
        name: 'Analytics Test Customer',
        mobile: '9999999999'
    });

    // 3. Seed Interactions (Activity)
    // - 2 Calls Today
    // - 3 WhatsApps Today
    // - 1 Call Last Month (Should be excluded from default filter)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const interactions = [
        { type: 'Call', agentId: testAgentId, agentName: 'Test Agent 007', date: today, customer: customer._id },
        { type: 'Call', agentId: testAgentId, agentName: 'Test Agent 007', date: today, customer: customer._id }, // 2nd Call
        { type: 'WhatsApp', agentId: testAgentId, agentName: 'Test Agent 007', date: today, customer: customer._id }, 
        { type: 'WhatsApp', agentId: testAgentId, agentName: 'Test Agent 007', date: today, customer: customer._id },
        { type: 'WhatsApp', agentId: testAgentId, agentName: 'Test Agent 007', date: today, customer: customer._id }, // 3rd WA
        { type: 'Call', agentId: testAgentId, agentName: 'Test Agent 007', date: lastMonth, customer: customer._id }, // Old
    ];
    await Interaction.insertMany(interactions);
    console.log('2. Seeded Interactions: 5 Today, 1 Last Month');

    // 4. Seed Sales (Policies)
    // - 1 Policy Renewed Today (Premium 5000)
    // - 1 Policy Pending Today
    // - 1 Policy Renewed Last Month (Premium 2000)
    const policies = [
        { 
            customer: customer._id, 
            assignedAgent: testAgentId, 
            renewalStatus: 'Renewed', 
            renewalDate: today, 
            totalPremiumPaid: 5000,
            // Required Fields
            vehicle: { regNumber: 'TEST-JH01-0001', make: 'Maruti', model: 'Alto' },
            policyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            insurer: 'TestInsurer'
        },
        { 
            customer: customer._id, 
            assignedAgent: testAgentId, 
            renewalStatus: 'Pending', 
            renewalDate: today, 
            totalPremiumPaid: 0,
            vehicle: { regNumber: 'TEST-JH01-PENDING', make: 'Hyundai', model: 'i20' },
            policyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
            insurer: 'TestInsurer'
        },
        { 
            customer: customer._id, 
            assignedAgent: testAgentId, 
            renewalStatus: 'Renewed', 
            renewalDate: lastMonth, 
            totalPremiumPaid: 2000,
            vehicle: { regNumber: 'TEST-JH01-OLD', make: 'Tata', model: 'Nexon' },
            policyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
            insurer: 'OldInsurer'
        }
    ];
    await InsurancePolicy.insertMany(policies);
    console.log('3. Seeded Policies: 1 Renewed Today (5000), 1 Old (2000)');

    // 5. RUN ANALYTICS LOGIC (Simulation)
    const start = new Date(today.getFullYear(), today.getMonth(), 1); // Start of Month
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    console.log(`\n--- RUNNING QUERY [${start.toISOString()} to ${end.toISOString()}] ---`);

    const agentActivity = await Interaction.aggregate([
        { 
            $match: { 
                date: { $gte: start, $lte: end },
                agentId: testAgentId 
            } 
        },
        {
            $group: {
                _id: "$agentId",
                calls: { $sum: { $cond: [{ $eq: ["$type", "Call"] }, 1, 0] } },
                whatsapp: { $sum: { $cond: [{ $eq: ["$type", "WhatsApp"] }, 1, 0] } },
                totalInteractions: { $sum: 1 }
            }
        }
    ]);

    const conversionStats = await InsurancePolicy.aggregate([
        { 
            $match: { 
                renewalStatus: 'Renewed',
                renewalDate: { $gte: start, $lte: end },
                assignedAgent: testAgentId
            } 
        },
        {
            $group: {
                _id: "$assignedAgent",
                policiesSold: { $sum: 1 },
                totalPremium: { $sum: "$totalPremiumPaid" }
            }
        }
    ]);

    // 6. ASSERTIONS
    console.log('\n--- RESULTS ---');
    console.log('Activity:', agentActivity[0]);
    console.log('Sales:', conversionStats[0]);

    let passed = true;
    
    // Check Activity
    if (agentActivity[0].calls !== 2) { console.error('FAIL: Expected 2 Calls, got', agentActivity[0].calls); passed = false; }
    if (agentActivity[0].whatsapp !== 3) { console.error('FAIL: Expected 3 WhatsApp, got', agentActivity[0].whatsapp); passed = false; }
    
    // Check Sales
    if (conversionStats[0].policiesSold !== 1) { console.error('FAIL: Expected 1 Policy Sold, got', conversionStats[0].policiesSold); passed = false; }
    if (conversionStats[0].totalPremium !== 5000) { console.error('FAIL: Expected 5000 Premium, got', conversionStats[0].totalPremium); passed = false; }

    if (passed) {
        console.log('\n✅ TEST PASSED: Analytics Logic is Correct.');
    } else {
        console.error('\n❌ TEST FAILED.');
    }

    // 7. CLEANUP
    console.log('\n--- CLEANING UP ---');
    await User.findByIdAndDelete(testAgentId);
    await Customer.findByIdAndDelete(customer._id);
    await Interaction.deleteMany({ agentId: testAgentId }); // Dangerous if ID conflict, but safe with ObjectId
    await InsurancePolicy.deleteMany({ assignedAgent: testAgentId });
    
    console.log('Cleanup Done. Exiting.');
    process.exit(passed ? 0 : 1);
};

runTest();
