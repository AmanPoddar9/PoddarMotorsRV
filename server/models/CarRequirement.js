const mongoose = require('mongoose');

const carRequirementSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    trim: true
  },
  budgetMin: {
    type: Number,
    default: 0
  },
  budgetMax: {
    type: Number,
    required: true
  },
  yearMin: {
    type: Number,
    default: 2010
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarRequirement', carRequirementSchema);
