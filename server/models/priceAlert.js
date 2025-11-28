const mongoose = require('mongoose')

const priceAlertSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  alertType: {
    type: String,
    enum: ['price_drop', 'any_change', 'specific_price'],
    required: true
  },
  targetPrice: {
    type: Number
  },
  currentPrice: {
    type: Number,
    required: true
  },
  carName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastNotified: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index for faster queries
priceAlertSchema.index({ email: 1, isActive: 1 })
priceAlertSchema.index({ listingId: 1, isActive: 1 })

const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema)

module.exports = PriceAlert
