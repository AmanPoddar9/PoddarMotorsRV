const { createClient } = require('@deepgram/sdk');
const OpenAI = require('openai');
const CallAnalysis = require('../models/CallAnalysis');
const Customer = require('../models/Customer');
const CarRequirement = require('../models/CarRequirement');
const { generateCustomId } = require('../utils/idGenerator');

// Initialize Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for OpenAI analysis
// Token-Optimized System Prompt (Reduces input cost)
const SALES_MANAGER_PROMPT = `
Role: Sales Analyst for "Poddar Motors - Real Value" (Used Car Dealer).
Task: Analyze this transcript of a FACE-TO-FACE showroom interaction between a Sales Rep and a Customer.

Output JSON only. No markdown.

schema:
{
  "is_sales_interaction": boolean,
  "customer_name": "string/null",
  "customer_sentiment": "Positive" | "Neutral" | "Negative" | "Hostile",
  "summary": "1 sentence brief",
  "topics_discussed": ["string"],
  "objections_raised": ["string"],
  "action_items": [{"task": "string", "due_date": "string/null"}],
  "structured_data": {
    "address": "string/null",
    "preferred_car": ["string"],
    "budget": "string/null",
    "payment_method": "Cash" | "Finance" | "Unknown",
    "finance_details": { "down_payment": "string/null", "finance_amount": "string/null" },
    "employment_type": "Business" | "Govt Job" | "Pvt Job" | "Other" | "Unknown",
    "documents_discussed": ["string"],
    "customer_status": "Hot" | "Warm" | "Cold" | "Unknown"
  },
  "coaching": {
    "brand_pitch_detected": boolean,
    "process_explained": boolean,
    "value_props_mentioned": ["string"],
    "feedback": "Brief feedback"
  }
}

Definitions:
- Status: Hot=Ready/Urgent, Warm=Interested, Cold=Browsing.
- Payment: Finance=Loan/EMI, Cash=Full/Cheque.
`;

/**
 * Extract phone number from transcript using regex
 */
function extractPhoneNumber(transcript) {
  // Match Indian phone numbers (10 digits, optionally with +91, 0, spaces, hyphens)
  const phoneRegex = /(?:\+91[-\s]?)?(?:0)?([6-9]\d{9})/g;
  const matches = transcript.match(phoneRegex);
  
  if (matches && matches.length > 0) {
    // Return the first match, cleaned
    return matches[0].replace(/[^\d]/g, '').slice(-10);
  }
  
  return null;
}

/**
 * Smart customer matching with confidence scoring
 */
async function findCustomerMatches(customerName, phoneNumber) {
  const matches = [];
  
  if (!customerName) return matches;
  
  // Strategy 1: Exact phone number match (highest confidence)
  if (phoneNumber) {
    const phoneMatch = await Customer.findOne({ mobile: phoneNumber });
    if (phoneMatch) {
      matches.push({
        customerId: phoneMatch._id,
        customerName: phoneMatch.name,
        mobile: phoneMatch.mobile,
        email: phoneMatch.email,
        customId: phoneMatch.customId,
        lastContact: phoneMatch.updatedAt,
        confidenceScore: 95,
        matchReasons: ['phone_exact']
      });
      return matches; // High confidence, return immediately
    }
  }
  
  // Strategy 2: Exact name match (case-insensitive)
  const exactNameMatches = await Customer.find({
    name: { $regex: new RegExp(`^${customerName}$`, 'i') }
  }).limit(5);
  
  for (const customer of exactNameMatches) {
    matches.push({
      customerId: customer._id,
      customerName: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      customId: customer.customId,
      lastContact: customer.updatedAt,
      confidenceScore: 80,
      matchReasons: ['name_exact']
    });
  }
  
  // Strategy 3: Fuzzy name match (contains)
  if (matches.length === 0) {
    // 3a. Full Name Contains
    const fuzzyMatches = await Customer.find({
      name: { $regex: new RegExp(customerName, 'i') }
    }).limit(5);
    
    for (const customer of fuzzyMatches) {
        if (!matches.some(m => m.customerId.equals(customer._id))) {
             matches.push({
                customerId: customer._id,
                customerName: customer.name,
                mobile: customer.mobile,
                email: customer.email,
                customId: customer.customId,
                lastContact: customer.updatedAt,
                confidenceScore: 60,
                matchReasons: ['name_similar']
              });
        }
    }

    // 3b. First Name Match (Fallback: "Rohit" should match "Rohit Kumar")
    if (matches.length === 0 && customerName.includes(' ')) {
        const firstName = customerName.split(' ')[0];
        if (firstName.length > 2) { // Avoid searching for 'Mr', 'Dr'
             const firstNameMatches = await Customer.find({
                name: { $regex: new RegExp(firstName, 'i') }
             }).limit(5);

             for (const customer of firstNameMatches) {
                 if (!matches.some(m => m.customerId.equals(customer._id))) {
                    matches.push({
                        customerId: customer._id,
                        customerName: customer.name,
                        mobile: customer.mobile,
                        email: customer.email,
                        customId: customer.customId,
                        lastContact: customer.updatedAt,
                        confidenceScore: 40, // Lower confidence
                        matchReasons: ['first_name_match']
                    });
                 }
             }
        }
    }
  }
  
  // Sort by confidence score
  return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

/**
 * Helper: Parse budget string like "12 lakhs" to number
 */
function parseBudget(budgetString) {
    if (!budgetString) return { min: 0, max: 0 };
    
    // Normalize text
    const text = budgetString.toLowerCase().replace(/,/g, '');
    let multiplier = 1;
    
    if (text.includes('lakh') || text.includes('lac')) multiplier = 100000;
    if (text.includes('crore') || text.includes('cr')) multiplier = 10000000;
    
    // Extract numbers
    const numbers = text.match(/[\d.]+/g);
    if (!numbers) return { min: 0, max: 0 };
    
    const nums = numbers.map(n => parseFloat(n) * multiplier);
    
    if (nums.length === 1) {
        // "Around 5 Lakhs" -> Min 4.5L, Max 5.5L (approx range)
        return { min: nums[0] * 0.9, max: nums[0] * 1.1 };
    } else if (nums.length >= 2) {
        // "5 to 6 Lakhs"
        return { min: Math.min(...nums), max: Math.max(...nums) };
    }
    
    return { min: 0, max: 0 };
}

/**
 * Analyze audio call with Deepgram + OpenAI
 * POST /api/audio/analyze
 */
exports.analyzeCall = async (req, res) => {
  try {
    const { audioUrl, duration } = req.body;
    
    if (!audioUrl || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: audioUrl, duration'
      });
    }

    // Create initial CallAnalysis record
    const callAnalysis = new CallAnalysis({
      audioUrl,
      duration,
      recordedBy: req.user._id,
      status: 'processing'
    });
    await callAnalysis.save();

    // Return immediately with processing ID
    res.status(202).json({
      success: true,
      message: 'Audio analysis started',
      analysisId: callAnalysis._id,
      status: 'processing'
    });

    // Process asynchronously
    processAudioAnalysis(callAnalysis._id, audioUrl);

  } catch (error) {
    console.error('Error starting analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start analysis',
      error: error.message
    });
  }
};

/**
 * Background processing function
 */
async function processAudioAnalysis(analysisId, audioUrl) {
  try {
    const callAnalysis = await CallAnalysis.findById(analysisId);
    if (!callAnalysis) return;

    // Step 1: Transcribe with Deepgram
    console.log(`[CallAnalysis ${analysisId}] Starting Deepgram transcription...`);
    
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      {
        model: 'nova-2',
        language: 'hi', // Hindi/English mixing
        diarize: true, // Speaker identification
        smart_format: true,
        punctuate: true,
        filler_words: true,
        utterances: true,
        utt_split: 0.5
      }
    );

    if (error) {
      throw new Error(`Deepgram error: ${error.message}`);
    }

    // Extract transcript and diarization
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const utterances = result.results.utterances || [];
    
    const diarization = utterances.map(utt => ({
      speaker: `Speaker ${utt.speaker}`,
      text: utt.transcript,
      timestamp: utt.start
    }));

    callAnalysis.transcript = transcript;
    callAnalysis.diarization = diarization;
    await callAnalysis.save();

    console.log(`[CallAnalysis ${analysisId}] Transcription completed. Length: ${transcript.length} chars`);

   // Smart Diarization Fallback
    // If Deepgram detected only 1 speaker, use GPT-4o to re-diarize
    let enhancedTranscript = transcript;
    const speakerCount = new Set(diarization.map(d => d.speaker)).size;
    
    if (speakerCount <= 1 && diarization.length > 0) {
      console.log(`[CallAnalysis ${analysisId}] Only ${speakerCount} speaker detected. Attempting AI re-diarization...`);
      
      try {
        const diarizationPrompt = `You are an expert editor. The following text contains a conversation between two people (Sales Rep and Customer), but the transcription software merged them into one speaker.

Please rewrite the transcript by determining the speaker turns based on context, questions, and answers.
- Assign "Speaker 0:" to the Sales Rep.
- Assign "Speaker 1:" to the Customer.
- Output ONLY the rewritten transcript with labels "Speaker 0:" and "Speaker 1:".

Raw Text:
${transcript}`;

        const fixResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.1,
          messages: [{ role: 'user', content: diarizationPrompt }]
        });

        const fixedTranscript = fixResponse.choices[0].message.content;
        
        if (fixedTranscript.includes('Speaker 1:')) {
          console.log(`[CallAnalysis ${analysisId}] AI re-diarization successful`);
          enhancedTranscript = fixedTranscript;
          
          // Update diarization in database
          callAnalysis.transcript = enhancedTranscript;
          await callAnalysis.save();
        }
      } catch (diarizeError) {
        console.error(`[CallAnalysis ${analysisId}] Fallback diarization failed:`, diarizeError.message);
        // Continue with original transcript
      }
    }

    // Step 2: Analyze with OpenAI GPT-4o
    console.log(`[CallAnalysis ${analysisId}] Starting OpenAI analysis...`);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: SALES_MANAGER_PROMPT },
        { role: 'user', content: `Transcript:\n\n${enhancedTranscript}` }
      ]
    });

    const analysisText = completion.choices[0].message.content.trim();
    
    // Parse JSON response (remove markdown if present)
    let analysisData;
    try {
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', analysisText);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Map to schema
    callAnalysis.analysis = {
      isSalesCall: analysisData.is_sales_interaction ?? analysisData.is_sales_call,
      customerName: analysisData.customer_name,
      summary: analysisData.summary,
      topicsDiscussed: analysisData.topics_discussed || [],
      customerSentiment: analysisData.customer_sentiment || 'Neutral',
      objectionsRaised: analysisData.objections_raised || [],
      actionItems: analysisData.action_items || []
    };
    
    // Phase 2: Enhanced Extraction
    if (analysisData.structured_data) {
      callAnalysis.structuredData = {
        address: analysisData.structured_data.address,
        preferredCar: analysisData.structured_data.preferred_car,
        budget: analysisData.structured_data.budget,
        paymentMethod: analysisData.structured_data.payment_method,
        financeDetails: {
          downPayment: analysisData.structured_data.finance_details?.down_payment,
          financeAmount: analysisData.structured_data.finance_details?.finance_amount
        },
        employmentType: analysisData.structured_data.employment_type,
        documentsDiscussed: analysisData.structured_data.documents_discussed,
        customerStatus: analysisData.structured_data.customer_status
      };
    }
    
    if (analysisData.coaching) {
      callAnalysis.coaching = {
        brandPitchDetected: analysisData.coaching.brand_pitch_detected,
        processExplained: analysisData.coaching.process_explained,
        valuePropsMentioned: analysisData.coaching.value_props_mentioned,
        feedback: analysisData.coaching.feedback
      };
    }

    console.log(`[CallAnalysis ${analysisId}] Analysis completed. Customer: ${analysisData.customer_name}, Sentiment: ${analysisData.customer_sentiment}`);

    // Step 3: Smart Customer Matching (don't auto-create/update)
    if (callAnalysis.analysis.customerName) {
      const customerName = callAnalysis.analysis.customerName;
      const phoneNumber = extractPhoneNumber(enhancedTranscript); // Extract from transcript
      
      console.log(`[CallAnalysis ${analysisId}] Searching for customer matches: name="${customerName}", phone="${phoneNumber}"`);
      
      const matches = await findCustomerMatches(customerName, phoneNumber);
      
      if (matches.length > 0) {
        console.log(`[CallAnalysis ${analysisId}] Found ${matches.length} potential customer match(es)`);
        callAnalysis.suggestedMatches = matches;
      } else {
        console.log(`[CallAnalysis ${analysisId}] No existing customer matches found`);
      }
    }

    // Mark as completed
    callAnalysis.status = 'completed';
    await callAnalysis.save();

    console.log(`[CallAnalysis ${analysisId}] Processing completed successfully`);

  } catch (error) {
    console.error(`[CallAnalysis ${analysisId}] Processing failed:`, error);
    
    // Update record with error
    try {
      await CallAnalysis.findByIdAndUpdate(analysisId, {
        status: 'failed',
        error: error.message
      });
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }
  }
}

/**
 * Get call analysis history for authenticated user
 * GET /api/audio/history
 */
exports.getCallHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Admin can see all, employees see only their own
    const filter = req.user.role === 'admin' 
      ? {} 
      : { recordedBy: req.user._id };

    const calls = await CallAnalysis.find(filter)
      .populate('recordedBy', 'name email')
      .populate('linkedCustomer', 'name mobile customId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CallAnalysis.countDocuments(filter);

    res.json({
      success: true,
      data: calls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call history',
      error: error.message
    });
  }
};

/**
 * Get single call analysis details
 * GET /api/audio/:id
 */
exports.getCallDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await CallAnalysis.findById(id)
      .populate('recordedBy', 'name email')
      .populate('linkedCustomer', 'name mobile email customId areaCity');

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call analysis not found'
      });
    }

    // Check authorization (admin or owner)
    if (req.user.role !== 'admin' && call.recordedBy._id.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    res.json({
      success: true,
      data: call
    });
  } catch (error) {
    console.error('Error fetching call details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call details',
      error: error.message
    });
  }
};

/**
 * Confirm customer action (create/update/discard)
 * POST /api/audio/:id/confirm-customer
 */
exports.confirmCustomerAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, customerId, customerData } = req.body;

    // Validate input
    if (!action || !['create', 'update', 'discard'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be create, update, or discard'
      });
    }

    if (action === 'update' && !customerId) {
      return res.status(400).json({
        success: false,
        message: 'customerId required for update action'
      });
    }

    if ((action === 'create' || action === 'update') && !customerData) {
      return res.status(400).json({
        success: false,
        message: 'customerData required for create/update actions'
      });
    }

    // Fetch call analysis
    const callAnalysis = await CallAnalysis.findById(id);
    
    if (!callAnalysis) {
      return res.status(404).json({
        success: false,
        message: 'Call analysis not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && callAnalysis.recordedBy.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    // Check if already confirmed
    if (callAnalysis.customerAction !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Customer action already ${callAnalysis.customerAction}`
      });
    }

    let customer = null;

    if (action === 'create') {
      // Create new customer
      // 0. Generate Custom ID
      const customId = await generateCustomId();

      // Create new customer
      customer = new Customer({
        customId,
        name: customerData.name,
        // Treat empty strings as undefined to avoid Unique index collisions
        mobile: (customerData.mobile && customerData.mobile.trim() !== '') ? customerData.mobile : undefined,
        email: (customerData.email && customerData.email.trim() !== '') ? customerData.email : undefined,
        source: 'Walk-in',
        lifecycleStage: 'Lead',
        notes: [{
          content: `Sales Call Summary: ${callAnalysis.analysis.summary || 'No summary available'}`,
          addedBy: req.user._id,
          createdAt: new Date()
        }]
      });

      // Extract preferences from topics
      if (callAnalysis.analysis.topicsDiscussed) {
        const topics = callAnalysis.analysis.topicsDiscussed.join(' ').toLowerCase();
        if (topics.includes('suv')) customer.preferences.bodyTypes.push('SUV');
        if (topics.includes('sedan')) customer.preferences.bodyTypes.push('Sedan');
        if (topics.includes('hatchback')) customer.preferences.bodyTypes.push('Hatchback');
      }

      // Phase 3: Sync Sales Intelligence Data
      if (callAnalysis.structuredData) {
        customer.salesData = {
          budget: callAnalysis.structuredData.budget,
          preferredCar: callAnalysis.structuredData.preferredCar,
          paymentMethod: callAnalysis.structuredData.paymentMethod,
          financeDetails: callAnalysis.structuredData.financeDetails,
          employmentType: callAnalysis.structuredData.employmentType,
          lastCallAnalysisId: callAnalysis._id
        };

        // Also map address to root if available
        if (callAnalysis.structuredData.address) {
             customer.areaCity = callAnalysis.structuredData.address;
        }
      }

      await customer.save();
      callAnalysis.linkedCustomer = customer._id;

      // 4. Create Car Requirement (if data exists)
      if (callAnalysis.structuredData && callAnalysis.structuredData.preferredCar && callAnalysis.structuredData.preferredCar.length > 0) {
          const budgetRange = parseBudget(callAnalysis.structuredData.budget);
          
          // Create one requirement for the first preferred car
          // (Assuming primary preference is first)
          const primaryCar = callAnalysis.structuredData.preferredCar[0]; // "Honda City" or "Honda City 2020"
          
          if (primaryCar) {
               const newReq = new CarRequirement({
                  customer: customer._id,
                  brand: primaryCar.split(' ')[0] || 'Unknown', // "Honda"
                  model: primaryCar.split(' ').slice(1).join(' ') || 'Any', // "City"
                  budgetMin: budgetRange.min,
                  budgetMax: budgetRange.max || 0, // 0 means no limit? or required? Model says required.
                  yearMin: 2010 // Default
               });
               // Handle required Max Budget if parse failed
               if (!newReq.budgetMax) newReq.budgetMax = 50000000; // 5 Cr default cap if unknown

               await newReq.save();
               console.log(`[CallAnalysis] Auto-created CarRequirement for ${customer.name}: ${primaryCar}`);
          }
      }

    } else if (action === 'update') {
      // Update existing customer
      customer = await Customer.findById(customerId);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Update fields if provided
      if (customerData.name) customer.name = customerData.name;
      if (customerData.mobile) customer.mobile = customerData.mobile;
      if (customerData.email) customer.email = customerData.email;

      // Add call summary to notes
      customer.notes.push({
        content: `Sales Call Summary: ${callAnalysis.analysis.summary || 'No summary available'}`,
        addedBy: req.user._id,
        createdAt: new Date()
      });


      // Update lifecycle stage based on sentiment
      if (callAnalysis.analysis.customerSentiment === 'Positive' && customer.lifecycleStage === 'Lead') {
        customer.lifecycleStage = 'Prospect';
      }

      // Phase 3: Sync Sales Intelligence Data (Overwrite with latest)
      if (callAnalysis.structuredData) {
        customer.salesData = {
          budget: callAnalysis.structuredData.budget,
          preferredCar: callAnalysis.structuredData.preferredCar,
          paymentMethod: callAnalysis.structuredData.paymentMethod,
          financeDetails: callAnalysis.structuredData.financeDetails,
          employmentType: callAnalysis.structuredData.employmentType,
          lastCallAnalysisId: callAnalysis._id
        };
        
        // Also map address to root if available and not set
        if (callAnalysis.structuredData.address && !customer.areaCity) {
             customer.areaCity = callAnalysis.structuredData.address;
        }

        // 4b. Create/Update Car Requirement on Update too?
        // Let's create a NEW one to be safe, user can delete old ones.
        if (callAnalysis.structuredData.preferredCar && callAnalysis.structuredData.preferredCar.length > 0) {
             const budgetRange = parseBudget(callAnalysis.structuredData.budget);
             const primaryCar = callAnalysis.structuredData.preferredCar[0];
             
             if (primaryCar) {
                  const newReq = new CarRequirement({
                     customer: customer._id,
                     brand: primaryCar.split(' ')[0] || 'Unknown',
                     model: primaryCar.split(' ').slice(1).join(' ') || 'Any',
                     budgetMin: budgetRange.min,
                     budgetMax: budgetRange.max || 50000000,
                     yearMin: 2010
                  });
                  await newReq.save();
                  console.log(`[CallAnalysis] Auto-added new CarRequirement for existing ${customer.name}: ${primaryCar}`);
             }
        }
      }

      await customer.save();
      callAnalysis.linkedCustomer = customer._id;
    }

    // Update call analysis status
    callAnalysis.customerAction = action === 'discard' ? 'discarded' : 'confirmed';
    callAnalysis.confirmedBy = req.user._id;
    callAnalysis.confirmedAt = new Date();
    await callAnalysis.save();

    res.json({
      success: true,
      message: `Customer action ${action} completed successfully`,
      data: {
        callAnalysis,
        customer
      }
    });

  } catch (error) {
    console.error('Error confirming customer action:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm customer action',
      error: error.message
    });
  }
};
