const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['youtube', 'instagram', 'other'],
    required: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  videoId: {
    type: String, // Extracted ID for embeds
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  linkedListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
