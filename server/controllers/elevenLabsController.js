const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');
const { generateCustomId } = require('../utils/idGenerator');
const crypto = require('crypto');
const { sendEvent } = require('../services/facebookCAPIService');

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
// Handle Post-Call Transcript Webhook
exports.handleTranscriptWebhook = async (req, res) => {
  try {
    // 0. Verify Signature
    if (!verifySignature(req)) {
       console.warn('[ElevenLabs] Invalid or missing signature.');
       return res.status(401).json({ message: 'Unauthorized: Invalid signature' });
    }

    console.log('[ElevenLabs] DEBUG PAYLOAD:', JSON.stringify(req.body, null, 2));

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
    if (metadata) { 
         console.log('[ElevenLabs] Metadata keys:', Object.keys(metadata));
    }

    // 1. Extract Phone Number
    let rawPhone = 
      metadata?.whatsapp?.whatsapp_user_id || 
      metadata?.phone_call?.number || 
      metadata?.phone_call?.external_number || 
      metadata?.caller_id; 

    // Fallback: Check dynamic variables
    if (!rawPhone) {
         rawPhone = 
            analysis?.conversation_initiation_client_data?.dynamic_variables?.user_phone || 
            analysis?.conversation_initiation_client_data?.dynamic_variables?.system__caller_id;
    }
    
    if (!rawPhone) {
      console.warn('[ElevenLabs] No phone number found in webhook metadata. Payload might be from a web call or internal test.');
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

      // [Meta CAPI] Fire Lead Event for New Customer
      sendEvent('Lead', {
          phone: mobile,
          // IP/UserAgent not available in webhook usually, but we send what we have
      }, {
          content_name: 'Voice Agent Lead',
          source: 'ElevenLabs'
      });
    }

    // 4.5 Data Collection - Dynamic & Upgrade
    const collectedData = analysis?.data_collection_results;
    let explicitNotes = []; // To store dynamic data string

    if (collectedData) {
        let updates = [];
        const dataKeys = Object.keys(collectedData);
        console.log('[ElevenLabs] Collected Data Keys:', dataKeys);

        // Iterate through ALL collected data for efficient dynamic storage
        Object.entries(collectedData).forEach(([key, value]) => {
            if (['customer_name', 'customer_id', 'customer_city'].includes(key)) return;
            const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            // correctly handle { value: null } cases
            let displayValue = value;
            if (value && typeof value === 'object' && 'value' in value) {
                 displayValue = value.value;
            }
            if (displayValue === null || displayValue === undefined) displayValue = 'Not provided';
            
            explicitNotes.push(`[Data] ${readableKey}: ${displayValue}`);
        });

        // Specific Logic for Core Fields (Name, Email, City)
        // Name - Try multiple common variations
        let newName = 
            collectedData.customer_name?.value || collectedData.customer_name ||
            collectedData.name?.value || collectedData.name ||
            collectedData.user_name?.value || collectedData.user_name ||
            collectedData.client_name?.value || collectedData.client_name ||
            collectedData.customerName?.value || collectedData.customerName;

        // Ensure name is a string (handle case where ElevenLabs returns object with rationale)
        if (newName && typeof newName === 'object') {
             newName = newName.value || null;
        }

        if (newName && typeof newName === 'string') {
             console.log(`[ElevenLabs] Name detected: '${newName}'`);
             // Update if generic or new
             if (customer.name === 'Voice Agent Lead' || customer.name === 'New Customer' || customer.name === 'Unknown') {
                  customer.name = newName;
                  updates.push(`Name: ${newName}`);
             }
        }

        // Email
        let newEmail = collectedData.customer_email?.value || collectedData.customer_email;
        if (newEmail && typeof newEmail === 'object') newEmail = newEmail.value;

        if (newEmail && typeof newEmail === 'string' && (customer.email === 'No Email' || !customer.email)) {
             customer.email = newEmail.toLowerCase();
             updates.push(`Email: ${newEmail}`);
        }

        // City
        let newCity = collectedData.customer_city?.value || collectedData.customer_city || collectedData.city?.value || collectedData.city;
        if (newCity && typeof newCity === 'object') newCity = newCity.value;

        if (newCity && typeof newCity === 'string') {
            customer.areaCity = newCity;
            updates.push(`City: ${newCity}`);
        }

        // Budget
        let newBudget = collectedData.customer_budget?.value || collectedData.customer_budget;
        if (newBudget && typeof newBudget === 'object') newBudget = newBudget.value;

        if (newBudget) {
            const budgetNum = parseInt(newBudget.toString().replace(/[^0-9]/g, ''));
            if (!isNaN(budgetNum)) {
                if (!customer.preferences) customer.preferences = {};
                if (!customer.preferences.budgetRange) customer.preferences.budgetRange = {};
                customer.preferences.budgetRange.max = budgetNum;
                updates.push(`Budget: ${newBudget}`);
            }
        }

        // Save if any Core updates
        if (updates.length > 0) {
             console.log(`[ElevenLabs] Updated Customer ${customer.mobile}: ${updates.join(', ')}`);
             customer.notes.push({ 
                 content: `[System] Voice Agent captured details: ${updates.join(', ')}`, 
                 createdAt: new Date() 
             });
             await customer.save();
        }
    }

    // 4.6 Success Evaluation & Tagging (Dynamic)
    const evalResults = analysis?.evaluation_criteria_results;
    if (evalResults) {
        let tagsToAdd = [];
        const criteriaKeys = Object.keys(evalResults);
        
        criteriaKeys.forEach(key => {
             const result = evalResults[key];
             if (result === 'success' || result === 'pass' || result === true) {
                 // Format: appointment_requested -> VoiceAI: Appointment Requested
                 const readableTag = 'VoiceAI: ' + key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                 tagsToAdd.push(readableTag);
                 
                 // Specific Business Logic
                 if (key.includes('high_intent')) {
                     tagsToAdd.push('Hot Lead');
                     if (customer.lifecycleStage === 'Lead') customer.lifecycleStage = 'Prospect';
                 }
                 if (key.includes('appointment')) {
                     tagsToAdd.push('Appointment Requested'); 
                 }
             }
        });

        if (tagsToAdd.length > 0) {
            // Add unique tags
            if (!customer.tags) customer.tags = [];
            let newTags = tagsToAdd.filter(t => !customer.tags.includes(t));
            if (newTags.length > 0) {
                customer.tags.push(...newTags);
                console.log(`[ElevenLabs] Added tags to ${customer.mobile}: ${newTags.join(', ')}`);
                await customer.save();

                // [Meta CAPI] Fire Contact Event for High Intent/Appointment
                if (newTags.includes('Hot Lead') || newTags.includes('Appointment Requested')) {
                    sendEvent('Contact', {
                        phone: mobile,
                        email: customer.email !== 'No Email' ? customer.email : undefined,
                        city: customer.areaCity
                    }, {
                        content_name: 'Qualified Voice Lead',
                        status: newTags.join(', ')
                    });
                }
            }
        }
    }

    // 5. Create Interaction
    const summary = analysis?.transcript_summary || analysis?.summary || 'No summary provided';
    
    // Create a readable transcript string (Length limited to avoid bloat in Remarks, full recording in metadata)
    const transcriptText = transcript && Array.isArray(transcript) 
      ? transcript.map(t => `${t.role}: ${t.message}`).join('\n')
      : 'No transcript available';

    // Outcome Analysis
    let outcome = 'General';
    if (analysis?.call_successful === 'success') outcome = 'Interested';

    // Append Collected Data to Remarks for Agent Visibility
    let finalRemark = `[Voice Agent Call]\nSummary: ${summary}`;
    if (explicitNotes.length > 0) {
        finalRemark += `\n\n📌 Collected Data:\n${explicitNotes.join('\n')}`;
    }
    finalRemark += `\n\nTranscript Snippet:\n${transcriptText.substring(0, 500)}...`;

    // Interaction Metadata (Efficient Storage)
    const interactionMetadata = {
        recording_url: payload.recording_url || analysis?.recording_url,
        call_duration_secs: metadata?.call_duration_secs,
        data_collection: collectedData,       // Store the raw object if small enough, or rely on notes
        evaluation_results: evalResults
    };

    const interaction = new Interaction({
      customer: customer._id,
      type: 'VoiceAgent',
      agentName: 'ElevenLabs AI',
      data: {
        remark: finalRemark, 
        outcome: outcome,
        conversation_id: conversation_id,
        duration: metadata?.call_duration_secs
      },
      metadata: interactionMetadata, // New Field
      date: new Date() 
    });

    await interaction.save();
    console.log(`[ElevenLabs] Interaction saved for customer ${customer.name} (${mobile})`);

    // 5. Also push to Customer Notes (so it appears in UI Timeline)
    // We already pushed core updates. Let's push a summary note if lots of data was collected? 
    // Actually, the Interaction log is usually enough for the timeline if the system UI shows interactions.
    // But let's keep the legacy behavior of adding a note for the call summary.
    customer.notes.push({
      content: `[Voice AI] ${interaction.data.outcome === 'Interested' ? '✅' : ''} ${analysis?.call_summary_title || 'Conversation'}\n\nSummary: ${summary}`,
      createdAt: new Date()
    });
    
    // If we have explicit data notes that weren't "Core updates" (like Favorite Color), we should add them too?
    // The previous loop only added Core updates to System Notes.
    // Let's add the FULL data dump to notes for visibility if not empty.
    if (explicitNotes.length > 0) {
         customer.notes.push({
             content: `[Voice AI] Data Collected:\n${explicitNotes.join('\n')}`,
             createdAt: new Date()
         });
    }

    // 6. Automated Follow-up (Instant WhatsApp via Meta Cloud)
    try {
        const { sendIntentBasedMessage } = require('./metaController'); // Lazy load
        
        let intent = 'voice-ai-general';
        
        // Determine Intent based on Eval Results
        if (evalResults) {
             const keys = Object.keys(evalResults);
             const isSuccess = (k) => ['success', 'pass', 'true', true].includes(evalResults[k]);

             // Check for Service/Workshop
             if (keys.some(k => (k.includes('appointment') || k.includes('service') || k.includes('repair')) && isSuccess(k))) {
                 intent = 'voice-ai-service';
             }
             // Check for Sales/Buying (Override Service if specifically High Intent Sales)
             else if (keys.some(k => (k.includes('buy') || k.includes('inventory') || k.includes('price')) && isSuccess(k))) {
                 intent = 'voice-ai-sales';
             }
             // Check High Intent Generic -> Sales
             else if (keys.some(k => k.includes('high_intent') && isSuccess(k))) {
                 intent = 'voice-ai-sales';
             }
        }

        console.log(`[ElevenLabs] Detected Intent: ${intent} for ${mobile}`);

        // Send WhatsApp via Meta
        const waResult = await sendIntentBasedMessage(mobile, intent);
        
        if (waResult.success) {
            console.log(`[ElevenLabs] Follow-up WhatsApp sent to ${mobile}`);
        } else {
             console.warn(`[ElevenLabs] WhatsApp failed for ${mobile}:`, waResult.error);
             // No SMS fallback configured for now as per Meta pivot
        }

    } catch (followUpError) {
        console.error('[ElevenLabs] Automated Follow-up Failed:', followUpError);
        // Don't fail the webhook because of this
    }

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('[ElevenLabs] Webhook Error:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
};
