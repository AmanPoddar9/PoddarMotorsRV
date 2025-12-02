const mongoose = require('mongoose')

// Sub-schemas for different inspection categories
const checkItemSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Warning', 'N/A'],
    required: true
  },
  notes: String,
  photos: [String] // S3 URLs
}, { _id: false })

const inspectionReportSchema = new mongoose.Schema({
  // Reference to booking
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InspectionBooking',
    required: true
  },
  
  // Inspector Details
  inspectorName: { 
    type: String, 
    required: true 
  },
  inspectorPhone: { 
    type: String, 
    required: true 
  },
  inspectionDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  inspectionDuration: { 
    type: Number, // in minutes
    required: false
  },
  
  // MECHANICAL INSPECTION (40 points)
  mechanical: {
    // Engine (12 points)
    engineStart: checkItemSchema,
    engineSound: checkItemSchema,
    engineOilLevel: checkItemSchema,
    engineOilCondition: checkItemSchema,
    coolantLevel: checkItemSchema,
    engineMounts: checkItemSchema,
    exhaustSmoke: checkItemSchema,
    engineVibration: checkItemSchema,
    timingBelt: checkItemSchema,
    sparkPlugs: checkItemSchema,
    airFilter: checkItemSchema,
    fuelFilter: checkItemSchema,
    
    // Transmission (8 points)
    transmissionOilLevel: checkItemSchema,
    transmissionOilCondition: checkItemSchema,
    clutchOperation: checkItemSchema,
    gearShifting: checkItemSchema,
    gearboxNoise: checkItemSchema,
    driveShaft: checkItemSchema,
    differentialOil: checkItemSchema,
    transmissionLeaks: checkItemSchema,
    
    // Brakes (10 points)
    frontBrakePads: checkItemSchema,
    rearBrakePads: checkItemSchema,
    brakeFluidLevel: checkItemSchema,
    brakeFluidCondition: checkItemSchema,
    brakePedal: checkItemSchema,
    handbrake: checkItemSchema,
    brakeDiscs: checkItemSchema,
    brakeLines: checkItemSchema,
    absSystem: checkItemSchema,
    brakePerformance: checkItemSchema,
    
    // Suspension (10 points)
    frontSuspension: checkItemSchema,
    rearSuspension: checkItemSchema,
    shockAbsorbers: checkItemSchema,
    springs: checkItemSchema,
    ballJoints: checkItemSchema,
    controlArms: checkItemSchema,
    steeringRack: checkItemSchema,
    powerSteering: checkItemSchema,
    wheelBearings: checkItemSchema,
    wheelAlignment: checkItemSchema
  },
  
  // ELECTRICAL SYSTEM (20 points)
  electrical: {
    batteryVoltage: checkItemSchema,
    batteryCondition: checkItemSchema,
    alternator: checkItemSchema,
    starterMotor: checkItemSchema,
    headlights: checkItemSchema,
    tailLights: checkItemSchema,
    indicators: checkItemSchema,
    fogLights: checkItemSchema,
    dashboardLights: checkItemSchema,
    warningLights: checkItemSchema,
    wipers: checkItemSchema,
    horn: checkItemSchema,
    powerWindows: checkItemSchema,
    centralLocking: checkItemSchema,
    infotainmentSystem: checkItemSchema,
    speakers: checkItemSchema,
    airConditioner: checkItemSchema,
    heater: checkItemSchema,
    sensors: checkItemSchema,
    ecuDiagnostics: checkItemSchema
  },
  
  // EXTERIOR CONDITION (20 points)
  exterior: {
    frontBumper: checkItemSchema,
    rearBumper: checkItemSchema,
    hood: checkItemSchema,
    roof: checkItemSchema,
    doors: checkItemSchema,
    fenders: checkItemSchema,
    paintCondition: checkItemSchema,
    rustCorrosion: checkItemSchema,
    windshield: checkItemSchema,
    rearGlass: checkItemSchema,
    sideGlass: checkItemSchema,
    headlightLenses: checkItemSchema,
    taillightLenses: checkItemSchema,
    mirrors: checkItemSchema,
    doorHandles: checkItemSchema,
    frontLeftTyre: checkItemSchema,
    frontRightTyre: checkItemSchema,
    rearLeftTyre: checkItemSchema,
    rearRightTyre: checkItemSchema,
    spareTyre: checkItemSchema
  },
  
  // INTERIOR CONDITION (15 points)
  interior: {
    driverSeat: checkItemSchema,
    passengerSeat: checkItemSchema,
    rearSeats: checkItemSchema,
    seatBelts: checkItemSchema,
    dashboard: checkItemSchema,
    steeringWheel: checkItemSchema,
    gearKnob: checkItemSchema,
    carpets: checkItemSchema,
    headliner: checkItemSchema,
    doorPanels: checkItemSchema,
    climateControls: checkItemSchema,
    interiorLights: checkItemSchema,
    sunroof: checkItemSchema,
    bootSpace: checkItemSchema,
    odorStains: checkItemSchema
  },
  
  // DOCUMENTATION & HISTORY (5 points)
  documentation: {
    registrationCertificate: checkItemSchema,
    insurance: checkItemSchema,
    servicingHistory: checkItemSchema,
    previousAccidents: checkItemSchema,
    ownershipHistory: checkItemSchema
  },
  
  // Overall Assessment
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: false
  },
  overallGrade: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: false
  },
  estimatedValue: {
    min: { type: Number },
    max: { type: Number }
  },
  recommendedStartingBid: {
    type: Number
  },
  
  // Inspector's Summary
  summary: {
    strengths: [String],
    weaknesses: [String],
    majorIssues: [String],
    recommendation: {
      type: String,
      enum: ['Ready for Auction', 'Needs Minor Repairs', 'Needs Major Repairs', 'Not Recommended'],
      required: true
    }
  },
  
  // Photos
  photos: {
    front: String,
    rear: String,
    left: String,
    right: String,
    interior: [String],
    engine: [String],
    chassis: String,
    odometer: String,
    damages: [String]
  },
  
  // Auction Status
  sentToAuction: {
    type: Boolean,
    default: false
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  }
}, {
  timestamps: true
})

// Method to calculate overall score
inspectionReportSchema.methods.calculateScore = function() {
  let totalPoints = 0
  let earnedPoints = 0
  
  const categories = ['mechanical', 'electrical', 'exterior', 'interior', 'documentation']
  
  categories.forEach(category => {
    const items = this[category]
    if (items) {
      Object.keys(items).forEach(key => {
        const item = items[key]
        if (item && item.status) {
          totalPoints++
          if (item.status === 'Pass') earnedPoints++
          else if (item.status === 'Warning') earnedPoints += 0.5
        }
      })
    }
  })
  
  this.overallScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  
  // Calculate grade
  if (this.overallScore >= 85) this.overallGrade = 'Excellent'
  else if (this.overallScore >= 70) this.overallGrade = 'Good'
  else if (this.overallScore >= 50) this.overallGrade = 'Fair'
  else this.overallGrade = 'Poor'
  
  return this.overallScore
}

// Indexes
inspectionReportSchema.index({ bookingId: 1 })
inspectionReportSchema.index({ overallScore: -1 })
inspectionReportSchema.index({ sentToAuction: 1 })

const InspectionReport = mongoose.model('InspectionReport', inspectionReportSchema)

module.exports = InspectionReport
