const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: 'Ranchi'
  },
  carModel: {
    type: String,
    required: true,
    trim: true,
    index: true // Indexed for faster filtering
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo'
  },
  mediaUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String, // For videos
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
