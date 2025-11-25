const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  callSid: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  callStatus: {
    type: String,
    enum: ['initiated', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer'],
    default: 'initiated',
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  ivrSelection: {
    type: String,
    enum: ['1', '2', '3', 'none'],
    default: 'none',
  },
  serviceType: {
    type: String,
    enum: ['car-buying', 'workshop', 'speak-to-team', 'unknown'],
    default: 'unknown',
  },
  smsStatus: {
    sent: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    messageSid: String,
    error: String,
  },
  whatsappStatus: {
    sent: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    messageSid: String,
    error: String,
  },
  forwardedToSales: {
    type: Boolean,
    default: false,
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  contacted: {
    type: Boolean,
    default: false,
  },
  contactedAt: {
    type: Date,
  },
  contactedBy: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
callLogSchema.index({ createdAt: -1 });
callLogSchema.index({ from: 1 });
callLogSchema.index({ serviceType: 1 });
callLogSchema.index({ followUpRequired: 1 });

module.exports = mongoose.model('CallLog', callLogSchema);
