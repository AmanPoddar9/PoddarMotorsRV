const mongoose = require('mongoose')

const inspectionTemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: String,
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  // Section 1: Categories & Check Items
  categories: [{
    id: { type: String, required: true }, // e.g., 'vehicleInfo', 'brakes'
    title: { type: String, required: true }, // e.g., "Vehicle Information"
    type: { 
      type: String, 
      enum: ['fields', 'checkItems'], 
      default: 'checkItems' 
    },
    
    // For 'fields' type (like Vehicle Info)
    fields: [{
      key: String,
      label: String,
      inputType: { 
        type: String, 
        enum: ['text', 'number', 'date', 'select', 'textarea'],
        default: 'text' 
      },
      options: [String], // For select inputs
      required: { type: Boolean, default: false }
    }],
    
    // For 'checkItems' type (standard inspection categories)
    checkItems: [{
      key: String,
      label: String,
      hasValue: { type: Boolean, default: false }, // if true, shows value input
      valueLabel: String 
    }]
  }],

  // Section 2: Photo Requirements
  photoRequirements: [{
    key: { type: String, required: true }, // e.g., 'front34'
    label: { type: String, required: true }, // e.g., "Front 3/4 View"
    minCount: { type: Number, default: 1 },
    maxCount: { type: Number, default: 1 },
    required: { type: Boolean, default: true },
    category: { type: String, default: 'General' } // Grouping (Exterior, Interior, etc.)
  }]
}, { 
  timestamps: true 
})

// Ensure only one default template exists
inspectionTemplateSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    )
  }
  next()
})

const InspectionTemplate = mongoose.model('InspectionTemplate', inspectionTemplateSchema)

module.exports = InspectionTemplate
