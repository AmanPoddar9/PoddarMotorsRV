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
    
    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('[ElevenLabs] Webhook Error:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
};
