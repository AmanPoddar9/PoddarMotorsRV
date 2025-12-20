const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  regNumber: { 
    type: String, 
    required: true,
    index: true 
  },
  serviceDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  serviceType: { 
    type: String, 
    enum: ['General Service', 'Repair', 'Inspection', 'Warranty', 'Other'],
    default: 'General Service'
  },
  description: { type: String },
  cost: { type: Number, default: 0 },
  mileage: { type: Number }, // Odometer reading
  nextServiceDue: { type: Date },
  
  // Admin who entered it
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
