const mongoose = require('mongoose')

const inspectionBookingSchema = new mongoose.Schema({
  // Customer Details
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    index: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: false 
  },
  
  // Car Details
  registrationNumber: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true
  },
  brand: { 
    type: String, 
    required: true 
  },
  model: { 
    type: String, 
    required: true 
  },
  variant: { 
    type: String, 
    required: false 
  },
  year: { 
    type: Number, 
    required: true 
  },
  kmDriven: { 
    type: Number, 
    required: true 
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    required: true
  },
  transmissionType: {
    type: String,
    enum: ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'],
    required: true
  },
  
  // Appointment Details
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  appointmentTimeSlot: {
    type: String,
    enum: ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'],
    required: true
  },
  inspectionLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  
  // Status & Assignment
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Inspector Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  assignedInspector: {
    name: { type: String },
    phone: { type: String },
    assignedAt: { type: Date }
  },
  
  // Inspector Access Token (for secure link-based report submission)
  inspectorToken: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to not conflict with unique constraint
    index: true
  },
  inspectorTokenExpiry: {
    type: Date
  },
  inspectorTokenUsed: {
    type: Boolean,
    default: false
  },
  
  // Payment Details
  inspectionFee: {
    type: Number,
    required: true,
    default: 499
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded', 'Failed', 'Free'],
    default: 'Pending'
  },
  paymentId: { 
    type: String 
  },
  orderId: { 
    type: String 
  },
  
  // References
  inspectionReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InspectionReport',
    required: false
  },
  
  // Timestamps
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String }
}, {
  timestamps: true
})

// Indexes
inspectionBookingSchema.index({ customerPhone: 1 })
inspectionBookingSchema.index({ registrationNumber: 1 })
inspectionBookingSchema.index({ status: 1 })
inspectionBookingSchema.index({ appointmentDate: 1 })

const InspectionBooking = mongoose.model('InspectionBooking', inspectionBookingSchema)

module.exports = InspectionBooking
