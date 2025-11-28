const mongoose = require('mongoose')

const viewCounterSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
    unique: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  currentViewers: [{
    sessionId: String,
    lastActive: {
      type: Date,
      default: Date.now
    }
  }],
  viewHistory: [{
    date: Date,
    count: Number
  }]
})

// Clean up stale viewers (inactive for > 5 minutes)
viewCounterSchema.methods.cleanStaleViewers = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  this.currentViewers = this.currentViewers.filter(
    viewer => viewer.lastActive > fiveMinutesAgo
  )
  return this.currentViewers.length
}

const ViewCounter = mongoose.model('ViewCounter', viewCounterSchema)

module.exports = ViewCounter
