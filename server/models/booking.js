const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual Populate
bookingSchema.virtual('listing', {
  ref: 'Listing',
  localField: 'listingId',
  foreignField: '_id',
  justOne: true
});

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
