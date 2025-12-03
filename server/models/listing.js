const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  images: { type: [String], required: false },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  variant: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  fuelType: {
    type: String,
    required: true,
  },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  ownership: { type: Number, required: true },
  kmDriven: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  transmissionType: { type: String, required: true },
  location: { type: String, required: true },
  featured: { type: Boolean, default: false },
  features: { type: [String], required: true },
  seats: { type: Number, required: false },
  displacement: { type: Number, required: false},
  cylinders: { type: Number, required: false },
  maxPower: { type: Number, required: false },
  bootspace: { type: Number, required: false },
  fuelTank: { type: Number, required: false },
  gears: { type: Number, required: false },
  mileage: { type: Number, required: false },
  // Deal-related fields
  isFeaturedDeal: { type: Boolean, default: false },
  dealEndDate: { type: Date, required: false },
  originalPrice: { type: Number, required: false },
  emiStarting: { type: Number, required: false },
})

// Indexes for frequently queried fields
listingSchema.index({ slug: 1 }); // Already unique, but explicit index
listingSchema.index({ brand: 1 }); // For brand filtering
listingSchema.index({ featured: 1 }); // For featured listings
listingSchema.index({ isFeaturedDeal: 1 }); // For deal listings
listingSchema.index({ price: 1 }); // For price sorting
listingSchema.index({ year: -1 }); // For year sorting (newest first)
listingSchema.index({ brand: 1, model: 1 }); // Compound index for brand+model queries
listingSchema.index({ type: 1, fuelType: 1 }); // For filtering by type and fuel

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing
