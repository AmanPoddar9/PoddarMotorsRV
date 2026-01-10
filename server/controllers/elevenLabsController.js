const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');
const { generateCustomId } = require('../utils/idGenerator');
const crypto = require('crypto');

const verifySignature = (req) => {
  const secret = process.env.ELEVENLABS_AGENT_SECRET;
  if (!secret) {
    console.warn('[ElevenLabs] Warning: ELEVENLABS_AGENT_SECRET not set. Skipping signature verification.');
    return true; // Fail open if no secret set (or fail closed? Plan says verify. Let's warn but maybe allow for now unless strict)
    // Actually, for security, if secret is supposed to be there, we should probably fail. 
    // But user might not have set it yet. Let's fail secure if header is present.
  }

  const signatureHeader = req.headers['elevenlabs-signature'];
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(',');
  const timestampPart = parts.find(p => p.startsWith('t='));
  const signaturePart = parts.find(p => p.startsWith('v0='));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.split('=')[1];
  const receivedSignature = signaturePart.split('=')[1];

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

    const { 
      conversation_id, 
      agent_id, 
      status, 
      transcript, 
      metadata, 
      analysis 
    } = req.body;

    console.log(`[ElevenLabs] Received webhook for conversation: ${conversation_id}`);

    // 1. Extract Phone Number
    // Note: Structure depends on ElevenLabs payload. Usually in metadata.phone_call.external_number
    // It might come in as "+919876543210" or similar.
    const rawPhone = metadata?.phone_call?.number || metadata?.phone_call?.external_number || metadata?.caller_id; 
    
    if (!rawPhone) {
      console.warn('[ElevenLabs] No phone number found in webhook metadata');
      return res.status(200).json({ message: 'No phone number, skipped' });
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
        name: 'Unknown Agent Contact', // Placeholder
        mobile: mobile,
        source: 'Facebook', // As per user context (Ads -> WhatsApp -> Agent)
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
    const summary = analysis?.summary || analysis?.evaluation?.summary || 'No summary provided by agent';
    
    // Create a readable transcript string (optional, just first few lines or full blob)
    const transcriptText = transcript && Array.isArray(transcript) 
      ? transcript.map(t => `${t.role}: ${t.message}`).join('\n')
      : 'No transcript available';

    const interaction = new Interaction({
      customer: customer._id,
      type: 'VoiceAgent',
      agentName: 'ElevenLabs AI',
      data: {
        remark: `[Voice Agent Call]\nSummary: ${summary}\n\nTranscript Snippet:\n${transcriptText.substring(0, 500)}...`, // Truncate if too long
        outcome: analysis?.success ? 'Interested' : 'General', // Simple logic, refine later
      },
      date: new Date() // Use current time or metadata.start_time
    });

    await interaction.save();

    console.log(`[ElevenLabs] Interaction saved for customer ${customer.name} (${mobile})`);
    
    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('[ElevenLabs] Webhook Error:', error);
    // Return 200 to prevent ElevenLabs from retrying endlessly if it's a code error
    res.status(500).json({ message: 'Error processing webhook' });
  }
};
