const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  }
});

// Index for retrieving bids for an auction in chronological order
bidSchema.index({ auctionId: 1, amount: -1 });

module.exports = mongoose.model('Bid', bidSchema);
