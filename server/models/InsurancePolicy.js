const mongoose = require('mongoose');

const insurancePolicySchema = new mongoose.Schema({
  // Relations
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // For "My Follow-ups"
  
  // Policy Details
  policyNumber: { type: String, trim: true, index: true }, // Made Optional for loose data collection
  insurer: { type: String, required: true }, // e.g., HDFC Ergo
  policyType: { type: String }, // Comprehensive, Zero Dep, Third Party
  source: { type: String }, // e.g., "Dealer", "Walk-in"
  
  // Dates (The source of truth)
  policyStartDate: { type: Date },
  policyEndDate: { type: Date, required: true, index: true }, // Used for Expiry Buckets
  
  // Vehicle Snapshot
  vehicle: {
    regNumber: { type: String, required: true, uppercase: true, index: true },
    make: { type: String },
    model: { type: String },
    variant: { type: String },
    year: { type: String },
    engineNumber: { type: String },
    chassisNumber: { type: String }
  },

  // Financials
  premiumAmount: { type: Number }, // Total Customer Paid
  ownDamagePremium: { type: Number },
  tpPremium: { type: Number },
  addonPremium: { type: Number },
  totalPremiumPaid: { type: Number }, // Redundant but useful?
  idv: { type: Number },
  ncb: { type: Number },
  currentAddons: [{ type: String }],
  
  // Commission / Profit
  commissionPercent: { type: Number },
  commissionAmount: { type: Number },
  paymentReceivedDate: { type: Date },
  profitTag: { type: String }, // 'High', 'Low'
  
  // Renewal Status & Workflow
  renewalStatus: { 
    type: String, 
    enum: ['Pending', 'InProgress', 'Renewed', 'Lost', 'NotInterested'], 
    default: 'Pending',
    index: true
  },
  
  // Granular Sales Stage
  renewalStage: {
      type: String, 
      enum: ['New', 'Contacted', 'FollowUp', 'QuoteSent', 'Reviewing', 'Negotiation', 'Accepted', 'PaymentPending', 'PaymentReceived', 'PolicyIssued', 'Closed'],
      default: 'New',
      index: true
  },

  // Reminder Tracking (New)
  reminderStatus: {
      type: String,
      enum: ['None', '30Day', '15Day', '7Day', '1Day', 'Due', 'Overdue'],
      default: 'None'
  },

  lostReason: {
      type: String,
      enum: ['PriceTooHigh', 'RenewedElsewhere', 'NoResponse', 'VehicleSold', 'NotRequired', 'BadExperience', 'Delay', 'Other', null],
      default: null
  },
  
  // Payment Tracking
  paymentStatus: { type: String, enum: ['NotInitiated', 'LinkSent', 'Pending', 'Received', 'Failed'], default: 'NotInitiated' },
  paymentMode: { type: String, enum: ['UPI', 'Card', 'NetBanking', 'Cash', 'Cheque', 'Check', 'Other', null] },
  paymentLink: { type: String },
  paymentReceivedDate: { type: Date },
  paymentTxnRef: { type: String },

  // Docs & Compliance
  docsStatus: { type: String, enum: ['NotRequested', 'Requested', 'Partial', 'Complete'], default: 'NotRequested' },
  docs: { 
      previousPolicy: { type: Boolean, default: false },
      aadhaar: { type: Boolean, default: false },
      pan: { type: Boolean, default: false }
  },
  
  // New: Document Links & Details
  documentLinks: {
      policyPdf: { type: String },
      proposalPdf: { type: String }
  },
  claimDetails: { type: String }, // History of claims

  complianceStatus: { type: String, enum: ['NotRequired', 'Pending', 'Completed'], default: 'Pending' },
  physicalFileCreated: { type: Boolean, default: false },
  fileLocation: { type: String },

  // Renewal Chain + History
  renewedFromPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy' },
  renewals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy' }], // Forward links

  // Interactions (Embedded)
  interactions: [{
      type: { type: String, enum: ['Call', 'WhatsApp', 'Email', 'Meeting', 'Other'] },
      outcome: { type: String }, // Enum validated in controller/service layer
      remark: { type: String },
      nextFollowUpDate: { type: Date },
      currStage: { type: String },
      currStatus: { type: String },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
  }],
  
  // Date Quality (For Invalid Dates)
  dataQuality: { type: String, enum: ['OK', 'InvalidEndDate', 'MissingEndDate'], default: 'OK' },
  rawPolicyEndDateString: { type: String },

  renewalDate: { type: Date }, // When it was renewed
  insurerAfterRenewal: { type: String },
  addonsAfterRenewal: [{ type: String }],
  idvAfterRenewal: { type: Number },
  
  // Follow-up (Top-level cache for indexing)
  nextFollowUpDate: { type: Date, index: true }, 
  lastInteractionDate: { type: Date }, 
  lastRemark: { type: String },
  
  // System Automation (Legacy? Keep for now)
  nextActions: [{
      type: { type: String }, 
      dueDate: { type: Date },
      status: { type: String, default: 'Pending' } 
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate active policies for same vehicle
// This allows history (same regNumber, different end date) but prevents duplicate entries for the same year
insurancePolicySchema.index({ 'vehicle.regNumber': 1, policyEndDate: 1 }, { unique: true });

insurancePolicySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('InsurancePolicy', insurancePolicySchema);
