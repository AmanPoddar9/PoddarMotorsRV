const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    default: 'Ranchi'
  },
  type: {
    type: String,
    required: [true, 'Please add job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: [true, 'Please add experience requirement']
  },
  salary: {
    type: String,
    required: [true, 'Please add salary range']
  },
  description: {
    type: String,
    required: [true, 'Please add job description']
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobListing', jobListingSchema);
