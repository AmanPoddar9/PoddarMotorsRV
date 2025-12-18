const mongoose = require('mongoose')

const sellRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', index: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  location: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  variant: { type: String },
  manufactureYear: { type: Number, required: true },
  kilometers: { type: Number, required: true },
  price: { type: Number },
  status: {
    type: String,
    enum: ['Created', 'Called', 'Approved', 'Rejected'],
    default: 'Created',
  },
  archived: { type: Boolean, default: false },
})

const SellRequest = mongoose.model('SellRequest', sellRequestSchema)

module.exports = SellRequest
