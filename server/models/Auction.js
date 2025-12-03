const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  inspectionReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InspectionReport',
    required: true
  },
  carDetails: {
    brand: String,
    model: String,
    variant: String,
    year: Number,
    registrationNumber: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  startingBid: {
    type: Number,
    required: true
  },
  currentBid: {
    type: Number,
    default: 0
  },
  reservePrice: {
    type: Number, // Hidden minimum price
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Live', 'Ended', 'Cancelled', 'Sold', 'Unsold'],
    default: 'Scheduled'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer'
  },
  totalBids: {
    type: Number,
    default: 0
  },
  minIncrement: {
    type: Number,
    default: 1000 // Minimum bid increment
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying of live auctions
auctionSchema.index({ status: 1, endTime: 1 });

module.exports = mongoose.model('Auction', auctionSchema);
