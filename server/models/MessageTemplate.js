const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['sms', 'whatsapp'],
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['car-buying', 'workshop'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  variables: [{
    name: String,
    defaultValue: String,
  }],
  active: {
    type: Boolean,
    default: true,
  },
  whatsappTemplateId: {
    type: String, // For WhatsApp approved template ID
  },
  language: {
    type: String,
    default: 'en',
  },
}, {
  timestamps: true,
});

// Index for faster queries
messageTemplateSchema.index({ type: 1, serviceType: 1 });

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema);
