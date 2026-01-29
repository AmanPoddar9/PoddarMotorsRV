const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Link to User model (optional, for employees who have login access)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Personal or Work email
  phone: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  
  // Addresses
  currentAddress: { type: String },
  permanentAddress: { type: String },

  // Emergency Contact
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    phone: { type: String }
  },

  // Professional Details
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  workEmail: { type: String }, // Official email if different
  employeeId: { type: String, unique: true, sparse: true }, // Custom ID (e.g., PM001)
  status: { 
    type: String, 
    enum: ['Active', 'On Leave', 'Terminated', 'Resigned'], 
    default: 'Active' 
  },

  // Banking (for reference, not processing)
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },

  // Documents (Links to S3)
  documents: [{
    title: { type: String }, // e.g., "Aadhar Card", "Contract"
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Assets Assigned
  assets: [{
    itemName: { type: String, required: true }, // e.g., "MacBook Pro", "SIM Card"
    identifier: { type: String }, // Serial Number, Phone Number
    assignedDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, enum: ['Assigned', 'Returned', 'Lost'], default: 'Assigned' }
  }]

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
