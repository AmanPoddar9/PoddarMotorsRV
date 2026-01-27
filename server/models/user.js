const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String }, // Added for agent identification
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'blogEditor', 'bookingManager', 'insurance_agent'], default: 'admin' },
  permissions: { type: [String], default: [] }, // Array of granular permissions
  isActive: { type: Boolean, default: true }, // Ability to disable access entirely
});

// Set password (hash)
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

// Validate password
userSchema.methods.validatePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
