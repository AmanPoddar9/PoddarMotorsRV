const mongoose = require('mongoose')

const scrapRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    location: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    manufactureYear: { type: Number, required: true },
    kilometers: { type: Number },
    condition: {
      type: String,
      enum: ['good', 'fair', 'poor'],
      required: true,
    },
    carType: {
      type: String,
      enum: ['hatchback', 'sedan', 'suv', 'muv'],
    },
    preferredPickupDate: { type: Date },
estimatedValue: { type: Number },
    status: {
      type: String,
      enum: ['Created', 'Contacted', 'Scheduled', 'Completed', 'Rejected'],
      default: 'Created',
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const ScrapRequest = mongoose.model('ScrapRequest', scrapRequestSchema)

module.exports = ScrapRequest
