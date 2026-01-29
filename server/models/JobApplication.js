const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  jobId: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: [true, 'Please provide a summary of your experience']
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
