const mongoose = require('mongoose')

const workshopBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  archived: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const WorkshopBooking = mongoose.model('WorkshopBooking', workshopBookingSchema)

module.exports = WorkshopBooking
