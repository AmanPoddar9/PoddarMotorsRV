const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  // Identity
  customId: { type: String, unique: true, index: true, sparse: true }, // e.g., PM-25-00001
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true, sparse: true }, // Made optional for offline customers, sparse allows duplicates of null/undefined
  mobile: { type: String, required: true, unique: true, index: true },
  alternatePhones: [{ type: String, index: true }], // Array for multiple contacts, indexed for search
  areaCity: { type: String }, // New field
  passwordHash: { type: String }, // Optional for offline customers
  
  // Vehicles (Hub storage for easy access)
  vehicles: [{
    regNumber: { type: String, index: true, required: true }, // Indexed for duplicate check
    chassisNo: { type: String },
    make: { type: String },
    model: { type: String },
    variant: { type: String },
    fuelType: { type: String },
    yearOfManufacture: { type: String },
    registrationDate: { type: Date }
  }],
  
  // Prime Membership
  primeStatus: {
    isActive: { type: Boolean, default: false },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Gold' },
    expiryDate: { type: Date },
    joinedAt: { type: Date },
    benefits: [{ type: String }], // List of all entitled benefits
    servicesAvailed: [{ type: String }] // List of benefits already used
  },

  // E-commerce Ready
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId }, // Generic ref for now
    productType: { type: String }, // 'Accessory', 'Service', etc.
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Future ref
  addresses: [{
    label: { type: String }, // 'Home', 'Office'
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    isDefault: { type: Boolean, default: false }
  }],

  // Lead Generation & Preferences
  preferences: {
    brands: [{ type: String }],
    budgetRange: {
      min: { type: Number },
      max: { type: Number }
    },
    bodyTypes: [{ type: String }], // SUV, Sedan, etc.
    transmission: { type: String }, // Manual, Automatic
    fuelType: { type: String }
  },
  
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Set password (hash)
customerSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

// Validate password
customerSchema.methods.validatePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Update timestamp on save
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
