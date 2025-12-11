const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy', index: true }, // Optional link to specific policy
  
  type: { 
    type: String, 
    enum: ['insurance_followup', 'sales_call', 'service_reminder', 'status_change', 'import_note', 'general'], 
    default: 'general' 
  },
  
  agentName: { type: String, required: true }, // Or link to Admin User ID
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  date: { type: Date, default: Date.now },
  
  data: {
    remark: { type: String },
    outcome: { type: String }, // 'Interested', 'Not Interested', 'Call Later'
    nextFollowUpDate: { type: Date, index: true },
    
    // For Status Changes
    statusBefore: { type: String },
    statusAfter: { type: String }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaction', interactionSchema);
