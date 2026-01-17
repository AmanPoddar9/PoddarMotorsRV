const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Interaction = require('../models/Interaction');

// Simple Lead Scoring Logic
// In a real agent, this could be replaced by an LLM analysis of the conversation history
const calculateScore = (customer, interactions) => {
    let score = 0;
    const reasons = [];

    // 1. Profile Completeness & Intent
    if (customer.preferences && (customer.preferences.budgetRange || customer.preferences.brands?.length > 0)) {
        score += 20;
        reasons.push('Has specific preferences/budget');
    }
    
    if (customer.mobile) {
        score += 10;
    }

    // 2. Lifecycle Stage
    if (customer.lifecycleStage === 'Lead') score += 10;
    if (customer.lifecycleStage === 'Prospect') score += 20;

    // 3. Prime Status
    if (customer.primeStatus?.isActive) {
        score += 50;
        reasons.push('Is Prime Member');
    }

    // 4. Interaction History
    if (interactions && interactions.length > 0) {
        // Sort interactions by date (newest first)
        const sortedInteractions = interactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastInteraction = sortedInteractions[0];
        
        // Recency
        const daysSinceLastInteraction = (new Date() - new Date(lastInteraction.date)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastInteraction < 3) {
            score += 30;
            reasons.push('Interacted in last 3 days');
        } else if (daysSinceLastInteraction < 7) {
            score += 15;
            reasons.push('Interacted in last 7 days');
        }

        // Outcome Analysis
        const positiveOutcomes = ['Interested', 'Call Later', 'Booked Test Drive', 'Quotation Sent'];
        const negativeOutcomes = ['Not Interested', 'Lost', 'Wrong Number'];

        if (lastInteraction.data?.outcome && positiveOutcomes.includes(lastInteraction.data.outcome)) {
            score += 40;
            reasons.push(`Last outcome: ${lastInteraction.data.outcome}`);
        }
        
        // Check for specific keywords in remarks (simulating AI understanding)
        const hotKeywords = ['pressing', 'urgent', 'buy', 'purchase', 'cash', 'finance approved'];
        if (lastInteraction.data?.remark) {
             const foundKeyword = hotKeywords.find(k => lastInteraction.data.remark.toLowerCase().includes(k));
             if (foundKeyword) {
                 score += 25;
                 reasons.push(`Keyword detected: "${foundKeyword}"`);
             }
        }
    } else {
        // No interactions? Can be an opportunity or a cold lead.
        // Let's treat valid leads with no interaction as "Needs Attention"
        score += 5; 
        reasons.push('Fresh lead / No history');
    }

    return { score, reasons };
};

const analyzeLeads = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB...');

        // 1. Fetch Candidates (Leads and Prospects)
        const customers = await Customer.find({
            lifecycleStage: { $in: ['Lead', 'Prospect'] }
        }).limit(50); // Limit for demo

        console.log(`Analyzing ${customers.length} potential leads...`);
        console.log('------------------------------------------------');

        const results = [];

        for (const customer of customers) {
            // 2. Fetch Context
            const interactions = await Interaction.find({ customer: customer._id });

            // 3. Apply Scoring Agent
            const { score, reasons } = calculateScore(customer, interactions);

            // 4. Recommendation
            let recommendation = 'Nurture';
            if (score > 80) recommendation = 'IMMEDIATE FOLLOW-UP (Call/WhatsApp)';
            else if (score > 50) recommendation = 'Priority Follow-up';
            else if (score < 20) recommendation = 'Low Priority / Automation Only';

            results.push({
                name: customer.name,
                mobile: customer.mobile,
                score,
                reasons: reasons.join(', '),
                recommendation
            });
        }

        // Sort by Score (Hot to Cold)
        results.sort((a, b) => b.score - a.score);

        // Display Top 10 Hot Leads
        console.table(results.slice(0, 10));

        // Output summary for logic check
        console.log('\nAnalysis Complete.');
        console.log(`Top Hot Lead: ${results[0]?.name} (Score: ${results[0]?.score})`);
        console.log(`Reason: ${results[0]?.reasons}`);
        console.log(`Action: ${results[0]?.recommendation}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

analyzeLeads();
