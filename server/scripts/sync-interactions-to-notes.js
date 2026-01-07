const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models
const Customer = require('../models/Customer');
const Interaction = require('../models/Interaction');
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

const syncInteractions = async () => {
    await connectDB();

    try {
        console.log('Starting sync...');
        let addedCount = 0;

        // 1. GLOBAL INTERACTIONS
        // Fetch all interactions that are likely insurance related
        // The Interaction model usually has type: 'insurance_followup', 'Call', 'WhatsApp' etc.
        // We'll fetch ALL linked to a customer and check if they are already in notes.
        const interactions = await Interaction.find({ 
            customer: { $exists: true } 
        });

        console.log(`Found ${interactions.length} global interactions.`);

        for (const interaction of interactions) {
            if (!interaction.customer) continue;

            const noteContent = `[Insurance ${interaction.type || 'Log'}] Outcome: ${interaction.data?.outcome || 'N/A'} \nRemark: ${interaction.data?.remark || interaction.remark || 'N/A'} \nNext Follow-up: ${interaction.data?.nextFollowUpDate ? new Date(interaction.data.nextFollowUpDate).toLocaleDateString() : 'N/A'}`;
            
            // Check existence
            const customer = await Customer.findById(interaction.customer);
            if (!customer) continue;

            const alreadyExists = customer.notes && customer.notes.some(n => n.content === noteContent);
            
            if (!alreadyExists) {
                await Customer.findByIdAndUpdate(interaction.customer, {
                    $push: {
                        notes: {
                            content: noteContent,
                            addedBy: interaction.agentId, // Ensure this field exists in Interaction or use fallback
                            createdAt: interaction.date || interaction.createdAt
                        }
                    }
                });
                addedCount++;
                process.stdout.write('.');
            }
        }

        console.log(`\nSynced ${addedCount} global interactions to notes.`);

        // 2. EMBEDDED POLICY INTERACTIONS
        // Some older data might only collect inside Policy.interactions
        const policies = await InsurancePolicy.find({ 
            'interactions.0': { $exists: true } 
        });

        console.log(`Found ${policies.length} policies with embedded interactions.`);
        let embeddedCount = 0;

        for (const policy of policies) {
            if (!policy.customer) continue;
            const customer = await Customer.findById(policy.customer);
            if (!customer) continue;

            for (const pInt of policy.interactions) {
                 const noteContent = `[Insurance ${pInt.type || 'Log'}] Outcome: ${pInt.outcome || 'N/A'} \nRemark: ${pInt.remark || 'N/A'}`;
                 
                 const alreadyExists = customer.notes && customer.notes.some(n => n.content === noteContent);
                 
                 if (!alreadyExists) {
                     await Customer.findByIdAndUpdate(policy.customer, {
                         $push: {
                             notes: {
                                 content: noteContent,
                                 addedBy: pInt.createdBy,
                                 createdAt: pInt.createdAt || new Date()
                             }
                         }
                     });
                     embeddedCount++;
                     process.stdout.write('+');
                 }
            }
        }

        console.log(`\nSynced ${embeddedCount} embedded policy interactions.`);
        console.log('Done!');
        process.exit(0);

    } catch (error) {
        console.error('Error during sync:', error);
        process.exit(1);
    }
};

syncInteractions();
