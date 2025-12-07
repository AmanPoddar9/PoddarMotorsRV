const mongoose = require('mongoose');

const primeEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  carModel: {
    type: String,
    trim: true
  },
  registrationNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  selectedPlan: {
    type: String,
    required: [true, 'Please select a plan'],
    enum: ['Silver', 'Gold', 'Platinum']
  },
  status: {
    type: String,
    default: 'New',
    enum: ['New', 'Contacted', 'Converted', 'Closed']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PrimeEnquiry', primeEnquirySchema);
