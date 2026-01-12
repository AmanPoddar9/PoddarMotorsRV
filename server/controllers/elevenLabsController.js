const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');
const { generateCustomId } = require('../utils/idGenerator');
const crypto = require('crypto');

const verifySignature = (req) => {
  const secret = process.env.ELEVENLABS_AGENT_SECRET;
  if (!secret) {
    console.warn('[ElevenLabs] Warning: ELEVENLABS_AGENT_SECRET not set. Skipping signature verification.');
    return true; 
  }

  const signatureHeader = req.headers['elevenlabs-signature'];
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(',');
  const timestampPart = parts.find(p => p.startsWith('t='));
  const signaturePart = parts.find(p => p.startsWith('v0='));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.split('=')[1];
  const receivedSignature = signaturePart.split('=')[1];

  // Logic: timestamp + "." + raw_body
  const message = `${timestamp}.${req.rawBody}`;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(message).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(digest));
};

// Handle Post-Call Transcript Webhook
exports.handleTranscriptWebhook = async (req, res) => {
  try {
    // 0. Verify Signature
    if (!verifySignature(req)) {
       console.warn('[ElevenLabs] Invalid or missing signature.');
       return res.status(401).json({ message: 'Unauthorized: Invalid signature' });
    }

    console.log('[ElevenLabs] DEBUG PAYLOAD:', JSON.stringify(req.body, null, 2));

    // New Format: { type: 'post_call_transcription', data: { ... } }
    // Legacy/Simple: { conversation_id: ... }
    const payload = req.body.data || req.body; 
    
    const { 
      conversation_id, 
      agent_id, 
      status, 
      transcript, 
      metadata, 
      analysis 
    } = payload;

    console.log(`[ElevenLabs] Received webhook for conversation: ${conversation_id}`);
    
    // Log metadata for debugging phone number location
    if (metadata) { // Avoid logging PII if possible, but structure is needed
         console.log('[ElevenLabs] Metadata keys:', Object.keys(metadata));
    }

    // 1. Extract Phone Number
    // Priority:
    // 0. metadata.whatsapp.whatsapp_user_id (WhatsApp Integration)
    // 1. metadata.phone_call.number (Standard Telephony)
    // 2. metadata.phone_call.external_number (Some legacy flows)
    // 3. metadata.caller_id (Sometimes used)
    
    let rawPhone = 
      metadata?.whatsapp?.whatsapp_user_id || 
      metadata?.phone_call?.number || 
      metadata?.phone_call?.external_number || 
      metadata?.caller_id; 

    // Fallback: Check dynamic variables (common in some agent setups)
    if (!rawPhone) {
         rawPhone = 
            analysis?.conversation_initiation_client_data?.dynamic_variables?.user_phone || 
            analysis?.conversation_initiation_client_data?.dynamic_variables?.system__caller_id;
    }
    
    if (!rawPhone) {
      console.warn('[ElevenLabs] No phone number found in webhook metadata. Payload might be from a web call or internal test.');
      // Proceeding without phone might be useful for logging sake, but we can't link to a Customer easily.
      // Let's create an "Unknown" customer or skip. Plan says skip to avoid junk.
      return res.status(200).json({ message: 'No phone number, interaction skipped' });
    }

    // 2. Normalize Mobile (Last 10 digits)
    const mobile = rawPhone.replace(/\D/g, '').slice(-10);

    // 3. Find Customer
    let customer = await Customer.findOne({ mobile });

    // 4. Create Customer if not exists (Lead)
    if (!customer) {
      console.log(`[ElevenLabs] New customer found: ${mobile}. Creating Lead...`);
      const customId = await generateCustomId();
      
      customer = new Customer({
        customId,
        name: 'Voice Agent Lead', 
        mobile: mobile,
        source: 'Voice Agent', 
        lifecycleStage: 'Lead',
        notes: [{
            content: `Auto-created from ElevenLabs Voice Agent call. Conversation ID: ${conversation_id}`,
            createdAt: new Date()
        }]
      });

      await customer.save();
    }

    // 4.5 Data Collection - Update Customer Details (Name, etc.)
    const collectedData = analysis?.data_collection_results;
    if (collectedData) {
        let updates = [];

        // Name
        const newName = collectedData.customer_name?.value || collectedData.customer_name; 
        if (newName && (customer.name === 'Voice Agent Lead' || customer.name === 'New Customer')) {
             customer.name = newName;
             updates.push(`Name: ${newName}`);
        }

        // Email
        const newEmail = collectedData.customer_email?.value || collectedData.customer_email;
        if (newEmail && !customer.email) {
            customer.email = newEmail.toLowerCase().trim();
            updates.push(`Email: ${newEmail}`);
        }

        // City
        const newCity = collectedData.customer_city?.value || collectedData.customer_city;
        if (newCity) {
            customer.areaCity = newCity;
            updates.push(`City: ${newCity}`);
        }

        // Budget
        const newBudget = collectedData.customer_budget?.value || collectedData.customer_budget;
        if (newBudget) {
            // Try to parse number if possible, or store as string in notes if schema is strict
            // Schema has budgetRange { min, max }. Let's assume max.
            const budgetNum = parseInt(newBudget.toString().replace(/[^0-9]/g, ''));
            if (!isNaN(budgetNum)) {
                if (!customer.preferences) customer.preferences = {};
                if (!customer.preferences.budgetRange) customer.preferences.budgetRange = {};
                customer.preferences.budgetRange.max = budgetNum;
                updates.push(`Budget: ${newBudget}`);
            }
        }

        // Save if any updates
        if (updates.length > 0) {
             console.log(`[ElevenLabs] Updated Customer ${customer.mobile}: ${updates.join(', ')}`);
             customer.notes.push({ 
                 content: `[System] Voice Agent captured details: ${updates.join(', ')}`, 
                 createdAt: new Date() 
             });
             await customer.save();
        }
    }

    // 4.6 Success Evaluation & Tagging
    const evalResults = analysis?.evaluation_criteria_results;
    if (evalResults) {
        let tagsToAdd = [];
        
        // Check for Appointment Request
        if (evalResults['appointment_requested'] === 'success' || evalResults['appointment_requested'] === 'pass') {
            tagsToAdd.push('Appointment Requested');
        }

        // Check for High Intent
        if (evalResults['high_intent'] === 'success' || evalResults['high_intent'] === 'pass') {
            tagsToAdd.push('Hot Lead');
            if (customer.lifecycleStage === 'Lead') {
                customer.lifecycleStage = 'Prospect'; // Upgrade stage
            }
        }

        if (tagsToAdd.length > 0) {
            // Add unique tags
            if (!customer.tags) customer.tags = [];
            let newTags = tagsToAdd.filter(t => !customer.tags.includes(t));
            if (newTags.length > 0) {
                customer.tags.push(...newTags);
                console.log(`[ElevenLabs] Added tags to ${customer.mobile}: ${newTags.join(', ')}`);
                await customer.save();
            }
        }
    }

    // 5. Create Interaction
    // Construct a summary from analysis or transcript
    const summary = analysis?.transcript_summary || analysis?.summary || 'No summary provided';
    
    // Create a readable transcript string
    const transcriptText = transcript && Array.isArray(transcript) 
      ? transcript.map(t => `${t.role}: ${t.message}`).join('\n')
      : 'No transcript available';

    // Outcome Analysis
    let outcome = 'General';
    if (analysis?.call_successful === 'success') outcome = 'Interested';
    // Check for specific keywords in summary if needed

    const interaction = new Interaction({
      customer: customer._id,
      type: 'VoiceAgent',
      agentName: 'ElevenLabs AI',
      data: {
        remark: `[Voice Agent Call]\nSummary: ${summary}\n\nTranscript Snippet:\n${transcriptText.substring(0, 500)}...`, 
        outcome: outcome,
        conversation_id: conversation_id,
        duration: metadata?.call_duration_secs
      },
      date: new Date() 
    });

    await interaction.save();
    console.log(`[ElevenLabs] Interaction saved for customer ${customer.name} (${mobile})`);

    // 5. Also push to Customer Notes (so it appears in UI Timeline)
    customer.notes.push({
      content: `[Voice AI] ${interaction.data.outcome === 'Interested' ? '✅' : ''} ${analysis?.call_summary_title || 'Conversation'}\n\nSummary: ${summary}`,
      createdAt: new Date()
    });
    await customer.save();
    
    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('[ElevenLabs] Webhook Error:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
};
