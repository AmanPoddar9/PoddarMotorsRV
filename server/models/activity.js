const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['view', 'test_drive', 'inquiry', 'purchase', 'chat'],
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  carName: String,
  userName: String,
  userLocation: String,
  message: String,
  ipAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // Auto-delete after 7 days
  }
})

// Index for faster queries - most recent first
activitySchema.index({ createdAt: -1 })
activitySchema.index({ listingId: 1, createdAt: -1 })

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity
