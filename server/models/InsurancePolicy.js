const mongoose = require('mongoose');

const insurancePolicySchema = new mongoose.Schema({
  // Relations
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // For "My Follow-ups"
  
  // Policy Details
  policyNumber: { type: String, required: true, trim: true, index: true }, // Not unique strictly globally? Maybe unique.
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
  
  // Renewal Workflow
  renewalStatus: { 
    type: String, 
    enum: ['Pending', 'InProgress', 'Renewed', 'Lost', 'NotInterested'], 
    default: 'Pending',
    index: true
  },
  renewalDate: { type: Date }, // When it was renewed
  insurerAfterRenewal: { type: String },
  addonsAfterRenewal: [{ type: String }],
  idvAfterRenewal: { type: Number },
  lostCaseReason: { type: String }, // If Lost
  
  // Follow-up (Denormalized)
  nextFollowUpDate: { type: Date, index: true }, // For "My Follow-ups" view
  lastRemark: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate active policies for same vehicle? 
// Optional, might want to allow it.
// insurancePolicySchema.index({ 'vehicle.regNumber': 1, expiryDate: 1 });

insurancePolicySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('InsurancePolicy', insurancePolicySchema);
