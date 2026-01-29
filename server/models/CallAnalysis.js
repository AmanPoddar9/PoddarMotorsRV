const mongoose = require('mongoose');

const callAnalysisSchema = new mongoose.Schema({
  // Audio metadata
  audioUrl: { type: String, required: true }, // S3 URL
  duration: { type: Number, required: true }, // Duration in seconds
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Transcription data
  transcript: { type: String }, // Full transcript text
  diarization: [{
    speaker: { type: String }, // Speaker 0, Speaker 1, etc.
    text: { type: String },
    timestamp: { type: Number } // Seconds from start
  }],
  
  // AI Analysis results
  analysis: {
    isSalesCall: { type: Boolean, default: false },
    customerName: { type: String },
    summary: { type: String }, // 2-sentence summary
    topicsDiscussed: [{ type: String }],
    customerSentiment: { 
      type: String, 
      enum: ['Positive', 'Neutral', 'Negative', 'Hostile'],
      default: 'Neutral'
    },
    objectionsRaised: [{ type: String }],
    actionItems: [{
      task: { type: String },
      dueDate: { type: String } // Approximate time or null
    }]
  },
  
  // Customer linking
  linkedCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  
  // Customer Action Tracking (Phase 1: Human Confirmation)
  customerAction: {
    type: String,
    enum: ['pending', 'confirmed', 'discarded'],
    default: 'pending'
  },
  
  // Phase 2: Enhanced Data Extraction & Coaching
  structuredData: {
    address: String,
    preferredCar: [String],
    budget: String,
    paymentMethod: { type: String, enum: ['Cash', 'Finance', 'Unknown'] },
    financeDetails: {
      downPayment: String,
      financeAmount: String
    },
    employmentType: { type: String, enum: ['Business', 'Govt Job', 'Pvt Job', 'Other', 'Unknown'] },
    documentsDiscussed: [String],
    customerStatus: { type: String, enum: ['Hot', 'Warm', 'Cold', 'Unknown'] }
  },
  
  coaching: {
    brandPitchDetected: Boolean,
    processExplained: Boolean,
    valuePropsMentioned: [String], // e.g., ["Warranty", "Certified 350+ Checks"]
    feedback: String
  },

  suggestedMatches: [{
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    customerName: String,
    mobile: String,
    email: String,
    customId: String,
    lastContact: Date,
    confidenceScore: Number, // 0-100
    matchReasons: [String] // ['name_exact', 'phone_match', 'name_similar', etc.]
  }],
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: Date,
  
  // Processing status
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  error: { type: String } // Error message if failed
}, {
  timestamps: true
});

// Update timestamp on save
callAnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CallAnalysis', callAnalysisSchema);
