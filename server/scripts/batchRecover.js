const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const { handleTranscriptWebhook } = require('../controllers/elevenLabsController');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'server', '.env') });
const connectDB = require('../config/db');

const batchRecover = async () => {
  try {
    await connectDB();
    console.log("DB Connected");

    // 1. Find all stuck leads from last 3 days to be safe
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const stuckLeads = await Customer.find({
        name: 'Voice Agent Lead',
        createdAt: { $gte: threeDaysAgo }
    }).sort({ createdAt: -1 });

    console.log(`Found ${stuckLeads.length} stuck leads.`);

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.error("No ELEVENLABS_API_KEY found!");
        process.exit(1);
    }

    // Bypass signature check globally
    const originalSecret = process.env.ELEVENLABS_AGENT_SECRET;
    process.env.ELEVENLABS_AGENT_SECRET = "";

    // 2. Iterate and Recover
    for (const lead of stuckLeads) {
        console.log(`\nProcessing Lead: ${lead.mobile} (${lead._id})`);
        
        // Find conversation ID
        const initialNote = lead.notes.find(n => n.content && n.content.includes("Conversation ID:"));
        if (!initialNote) {
            console.log(`Skipping - No Conversation ID found.`);
            continue;
        }

        const conversationId = initialNote.content.split("Conversation ID:")[1].trim();
        console.log(`Fetching Conv ID: ${conversationId}`);

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
                method: 'GET',
                headers: { 'xi-api-key': apiKey }
            });

            if (!response.ok) {
                console.error(`API Error (${response.status}) for ${lead.mobile}`);
                continue;
            }

            const apiData = await response.json();
            
            // Construct Payload
            const payload = {
                data: {
                    conversation_id: apiData.conversation_id,
                    status: apiData.status,
                    metadata: {
                        call_duration_secs: apiData.metadata?.call_duration_secs,
                        phone_call: { number: `+91${lead.mobile}` }
                    },
                    analysis: apiData.analysis,
                    transcript: apiData.transcript
                }
            };

            // Mock Req/Res
            const req = { method: 'POST', headers: {}, body: payload };
            const res = {
                statusCode: 200,
                status: function(code) { this.statusCode = code; return this; },
                json: function(data) { console.log(`Result: ${data.message}`); return this; }
            };

            await handleTranscriptWebhook(req, res);

        } catch (err) {
            console.error(`Failed to process ${lead.mobile}:`, err.message);
        }
        
        // Rate limit protection
        await new Promise(r => setTimeout(r, 1000));
    }

    process.env.ELEVENLABS_AGENT_SECRET = originalSecret;
    await mongoose.disconnect();
    console.log("\nBatch Recovery Completed.");

  } catch (error) {
    console.error("CRASH:", error);
    process.exit(1);
  }
};

batchRecover();
