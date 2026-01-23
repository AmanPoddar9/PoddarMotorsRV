const mongoose = require('mongoose')

// Sub-schema for check items with Pass/Fail/Warning/NA status
const checkItemSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Warning', 'N/A'],
    default: 'N/A'
  },
  notes: String,
  value: String // For numeric/text values (e.g., tread depth, DOT code)
}, { _id: false })

const inspectionReportSchema = new mongoose.Schema({
  // ==================== BASIC INFO ====================
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InspectionBooking',
    required: true
  },
  
  inspectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  inspectorName: {
    type: String,
    required: true
  },
  inspectorID: String,
  
  // ==================== 1. VEHICLE INFORMATION ====================
  vehicleInfo: {
    makeModelVariant: String,
    vinChassisNo: String,
    engineNo: String,
    registrationNo: String,
    fuelType: String,
    manufacturingYear: Number,
    registrationYear: Number,
    colour: String,
    carOdometer: Number, // km
    transmission: String, // Manual/Automatic
    ownershipNo: Number
  },
  
  // ==================== 2. DOCUMENTATION (30 fields) ====================
  documentation: {
    rcCopy: checkItemSchema,
    insurancePolicy: checkItemSchema,
    form29: checkItemSchema,
    form30: checkItemSchema,
    form35HPA: checkItemSchema,
    nocOfHPA: checkItemSchema,
    originalRoadTaxCopy: checkItemSchema,
    oldRegistrationCard: checkItemSchema,
    gstCertificate: checkItemSchema,
    serviceHistory: checkItemSchema,
    saleLetter: checkItemSchema,
    taxReceipt: checkItemSchema,
    aadhaarCardCopy: checkItemSchema,
    panCardCopy: checkItemSchema,
    affidavit: checkItemSchema,
    pucCertificate: checkItemSchema,
    
    rcCondition: checkItemSchema,
    rcMismatch: checkItemSchema,
    fitnessUpto: { type: Date },
    vehicleFlaggedForScrap: checkItemSchema,
    hypothecationStatus: String, // Active/Closed/None
    hpaNocReceived: checkItemSchema,
    insuranceType: String, // Comprehensive/Third Party
    insuranceExpiryDate: { type: Date },
    onRoadFineChallan: checkItemSchema,
    roadTaxValidTill: { type: Date }
  },
  
  // ==================== 3. FEATURES & EQUIPMENT (12 fields) ====================
  features: {
    noOfAirbags: Number,
    powerWindowsCount: Number,
    absPresent: checkItemSchema,
    rearDefogger: checkItemSchema,
    reverseCamera: checkItemSchema,
    parkingSensorsCount: Number,
    sunroof: checkItemSchema,
    cruiseControl: checkItemSchema,
    espEsc: checkItemSchema,
    tpms: checkItemSchema
  },
  
  // ==================== 4. WARNING LAMPS & DIAGNOSTICS (15 fields) ====================
  warningLamps: {
    engineMIL: checkItemSchema,
    absLight: checkItemSchema,
    airbagLight: checkItemSchema,
    oilPressureLight: checkItemSchema,
    temperatureLight: checkItemSchema,
    batteryChargingLight: checkItemSchema,
    epsLight: checkItemSchema,
    tpmsLight: checkItemSchema,
    svhsHybridLight: checkItemSchema,
    brakeWarning: checkItemSchema,
    chargingVoltageIdle: { type: String }, // e.g., "14.2V"
    crankingVoltageMin: { type: String } // e.g., "10.5V"
  },
  
  // ==================== 5. ENGINE & POWERTRAIN (15 fields) ====================
  engine: {
    engineSound: checkItemSchema,
    blowBy: checkItemSchema,
    exhaustSmoke: checkItemSchema, // White/Black/Blue
    engineOilFillerCapCondition: checkItemSchema, // Sludge/Creamy/Good
    engineOilLeaking: checkItemSchema,
    coolantLevel: checkItemSchema,
    coolantContamination: checkItemSchema,
    injectorNoise: checkItemSchema,
    timingBeltChainNoise: checkItemSchema,
    pistonNoise: checkItemSchema,
    turboCondition: checkItemSchema,
    oilSealLeaks: checkItemSchema // Front/Rear
  },
  
  // ==================== 6. TRANSMISSION & CLUTCH (12 fields) ====================
  transmission: {
    gear1Shift: checkItemSchema,
    gear2Shift: checkItemSchema,
    gear3Shift: checkItemSchema,
    gear4Shift: checkItemSchema,
    gear5Shift: checkItemSchema,
    reverseGearShift: checkItemSchema,
    synchronizerNoise: checkItemSchema,
    clutchPlate: checkItemSchema,
    pressurePlate: checkItemSchema,
    releaseBearing: checkItemSchema,
    clutchSlipUnderLoad: checkItemSchema,
    clutchBitePoint: checkItemSchema
  },
  
  // ==================== 7. SUSPENSION & STEERING (20 fields) ====================
  suspensionSteering: {
    overallSuspension: checkItemSchema,
    linkRods: checkItemSchema,
    tieRodEnds: checkItemSchema,
    lowerArmLHRH: checkItemSchema,
    upperArmIfEquipped: checkItemSchema,
    ballJoints: checkItemSchema,
    engineMountRH: checkItemSchema,
    engineMountLH: checkItemSchema,
    engineMountRR: checkItemSchema,
    intermediateShaft: checkItemSchema,
    rackPinionPlayBootTear: checkItemSchema,
    powerSteeringMotorEPS: checkItemSchema,
    powerSteeringOilHPS: checkItemSchema,
    rearSuspensionLeafSpring: checkItemSchema,
    frontRHShockAbsorber: checkItemSchema,
    frontLHShockAbsorber: checkItemSchema,
    rearRHShockAbsorber: checkItemSchema,
    rearLHShockAbsorber: checkItemSchema,
    bonnetShocker: checkItemSchema,
    dickeyTailgateShocker: checkItemSchema
  },
  
  // ==================== 8. TYRES & WHEELS (15 fields) ====================
  tyresWheels: {
    tyreLFTread: { type: String }, // mm
    tyreRFTread: { type: String },
    tyreLRTread: { type: String },
    tyreRRTread: { type: String },
    tyreSpareTread: { type: String },
    tyreLFDOT: { type: String }, // week-year
    tyreRFDOT: { type: String },
    tyreLRDOT: { type: String },
    tyreRRDOT: { type: String },
    alloyWheelDamage: checkItemSchema
  },
  
  // ==================== 9. BRAKES (20 fields) ====================
  brakes: {
    overallBrakes: checkItemSchema,
    rearBrakes: checkItemSchema,
    rearBrakeShoes: checkItemSchema,
    brakeDrumRR: checkItemSchema,
    frontRHDisc: checkItemSchema,
    frontLHDisc: checkItemSchema,
    rearRHDisc: checkItemSchema,
    rearLHDisc: checkItemSchema,
    calipers: checkItemSchema,
    brakeOilLevel: checkItemSchema,
    brakeOilCondition: checkItemSchema,
    handbrakeCables: checkItemSchema,
    handbrakeLever: checkItemSchema,
    handbrakeKnob: checkItemSchema,
    brakeVibrationShudder: checkItemSchema
  },
  
  // ==================== 10. BODY PANELS (20 fields) ====================
  bodyPanels: {
    bonnet: checkItemSchema,
    frontBumper: checkItemSchema,
    rearBumper: checkItemSchema,
    rhFender: checkItemSchema,
    lhFender: checkItemSchema,
    rhFRDoor: checkItemSchema,
    lhFRDoor: checkItemSchema,
    rhRRDoor: checkItemSchema,
    lhRRDoor: checkItemSchema,
    rhRunningBoard: checkItemSchema,
    lhRunningBoard: checkItemSchema,
    rhQuarterPanel: checkItemSchema,
    lhQuarterPanel: checkItemSchema,
    bootDickeyTailgate: checkItemSchema,
    roofCondition: checkItemSchema
  },
  
  // ==================== 11. STRUCTURAL INTEGRITY (15 fields) ====================
  structuralIntegrity: {
    apronLH: checkItemSchema,
    apronRH: checkItemSchema,
    lowerCrossMember: checkItemSchema,
    upperCrossMemberHeadlightSupport: checkItemSchema,
    radiatorSupport: checkItemSchema,
    cowlSlamPanel: checkItemSchema,
    chassis: checkItemSchema,
    abcPillars: checkItemSchema,
    firewall: checkItemSchema,
    floorPan: checkItemSchema,
    bootFloor: checkItemSchema,
    spareWheelWell: checkItemSchema,
    weldPastingJoints: checkItemSchema,
    paintThickness: { type: String } // selected panels
  },
  
  // ==================== 12. PAINT & GLASS (15 fields) ====================
  paintGlass: {
    frontWindshield: checkItemSchema,
    rearWindshield: checkItemSchema,
    frontRHDoorGlass: checkItemSchema,
    frontLHDoorGlass: checkItemSchema,
    rearRHDoorGlass: checkItemSchema,
    rearLHDoorGlass: checkItemSchema,
    rhQuarterGlass: checkItemSchema,
    lhQuarterGlass: checkItemSchema
  },
  
  // ==================== 13. EXTERIOR LIGHTS (18 fields) ====================
  exteriorLights: {
    rhHeadlamp: checkItemSchema,
    lhHeadlamp: checkItemSchema,
    rhFogLamp: checkItemSchema,
    lhFogLamp: checkItemSchema,
    rhTailLamp: checkItemSchema,
    lhTailLamp: checkItemSchema,
    rhQuarterPanelTailLamp: checkItemSchema,
    lhQuarterPanelTailLamp: checkItemSchema,
    rhDickyTailLamp: checkItemSchema,
    lhDickyTailLamp: checkItemSchema,
    numberPlateLamp: checkItemSchema,
    rhIndicatorFrontRear: checkItemSchema,
    lhIndicatorFrontRear: checkItemSchema,
    drls: checkItemSchema,
    hazardLamps: checkItemSchema
  },
  
  // ==================== 14. INTERIOR & CONTROLS (20 fields) ====================
  interiorControls: {
    doorPads: checkItemSchema,
    doorInnerPanels: checkItemSchema,
    seatCovers: checkItemSchema,
    dashboard: checkItemSchema,
    
    // Seat Conditions (Individual)
    driverSeatCondition: checkItemSchema,
    passengerSeatCondition: checkItemSchema,
    rearSeatCondition: checkItemSchema,
    thirdRowSeatCondition: checkItemSchema, // For 7-seaters
    
    seatBeltsAll: checkItemSchema,
    steeringWheelCover: checkItemSchema,
    seatInclineDecline: checkItemSchema,
    seatSlider: checkItemSchema,
    floorMats: checkItemSchema,
    
    // Functional Checks
    powerWindowsWorking: checkItemSchema,
    sunroofWorking: checkItemSchema,
    musicSystemWorking: checkItemSchema, // Android/Music system working
    
    acGrillsVents: checkItemSchema,
    musicSystem: checkItemSchema,
    acKnobRegulator: checkItemSchema,
    ceilingLights: checkItemSchema,
    headlinerCeilingCondition: checkItemSchema,
    windshieldFrame: checkItemSchema,
  },
  
  // ==================== 15. MIRRORS, WINDOWS & WIPERS (20 fields) ====================
  mirrorsWindowsWipers: {
    lhMirrorORVM: checkItemSchema,
    rhMirrorORVM: checkItemSchema,
    powerMirrorAdjust: checkItemSchema,
    powerMirrorFold: checkItemSchema,
    windowMotorFRRH: checkItemSchema,
    windowMotorFRLH: checkItemSchema,
    windowMotorRRRH: checkItemSchema,
    windowMotorRRLH: checkItemSchema,
    masterWindowSwitch: checkItemSchema,
    individualWindowSwitches: checkItemSchema,
    frontWiperBlade: checkItemSchema,
    rearWiperBlade: checkItemSchema,
    frontWiperArms: checkItemSchema,
    rearWiperArm: checkItemSchema,
    frontWiperMotor: checkItemSchema,
    rearWiperMotor: checkItemSchema,
    washerWaterTank: checkItemSchema,
    washerTankMotor: checkItemSchema,
    washerPipes: checkItemSchema,
    frontNozzles: checkItemSchema,
    rearNozzles: checkItemSchema
  },
  
  // ==================== 16. LATCHES & LOCKS (12 fields) ====================
  latchesLocks: {
    frRHDoorLatch: checkItemSchema,
    frLHDoorLatch: checkItemSchema,
    rrRHDoorLatch: checkItemSchema,
    rrLHDoorLatch: checkItemSchema,
    dickyLatch: checkItemSchema,
    frRHReleaseLever: checkItemSchema,
    frLHReleaseLever: checkItemSchema,
    rrRHReleaseLever: checkItemSchema,
    rrLHReleaseLever: checkItemSchema,
    dickyReleaseLever: checkItemSchema,
    steeringLock: checkItemSchema,
    centralLocking: checkItemSchema
  },
  
  // ==================== 17. HVAC PERFORMANCE (12 fields) ====================
  hvacPerformance: {
    ventTempAtIdle: { type: String }, // °C
    ventTempAt1500rpm: { type: String }, // °C
    acCompressor: checkItemSchema,
    acBelt: checkItemSchema,
    blower: checkItemSchema,
    refrigerantGasLevel: checkItemSchema,
    condenserGrillCleanliness: checkItemSchema,
    highPressurePipe: checkItemSchema,
    lowPressurePipe: checkItemSchema,
    modeRecircFlaps: checkItemSchema
  },
  
  // ==================== 18. UNDERBODY & EXHAUST (15 fields) ====================
  underbodyExhaust: {
    subframeBentImpact: checkItemSchema,
    engineUnderGuardPresent: checkItemSchema,
    exhaustLeaks: checkItemSchema,
    catalystDPFIntact: checkItemSchema,
    heatShields: checkItemSchema,
    exhaustHangersCondition: checkItemSchema,
    oilLeaksUnderbody: checkItemSchema,
    gearboxLeaksUnderbody: checkItemSchema,
    brakeLinesLeaks: checkItemSchema,
    fuelLinesLeaks: checkItemSchema,
    rustUnderbody: checkItemSchema
  },
  
  // ==================== 19. DRIVELINE & AXLES (15 fields) ====================
  drivelineAxles: {
    frRHAxleOilSeal: checkItemSchema,
    frLHAxleOilSeal: checkItemSchema,
    rrRHAxleOilSeal: checkItemSchema,
    rrLHAxleOilSeal: checkItemSchema,
    crankOilSeal: checkItemSchema,
    frRHWheelBearing: checkItemSchema,
    frLHWheelBearing: checkItemSchema,
    rrRHWheelBearing: checkItemSchema,
    rrLHWheelBearing: checkItemSchema,
    rhStrutTopBearing: checkItemSchema,
    lhStrutTopBearing: checkItemSchema,
    crossBearing: checkItemSchema,
    counterBearing: checkItemSchema,
    propellerShaftCVBoots: checkItemSchema
  },
  
  // ==================== 20. ROAD TEST (12 fields) ====================
  roadTest: {
    straightLinePull: checkItemSchema,
    steeringOnCentre: checkItemSchema,
    vibrationAt40: checkItemSchema,
    vibrationAt60: checkItemSchema,
    vibrationAt80: checkItemSchema,
    brakeShudder: checkItemSchema,
    suspensionKnocks: checkItemSchema,
    turboWhistle: checkItemSchema,
    acEffectiveWhileDriving: checkItemSchema
  },
  
  // ==================== 21. FLOOD/FIRE DETECTION (8 fields) ====================
  floodFireDetection: {
    waterLineMarks: checkItemSchema,
    siltUnderCarpets: checkItemSchema,
    seatAnchorBoltCorrosion: checkItemSchema,
    connectorOxidation: checkItemSchema,
    mustySmell: checkItemSchema,
    burntWiringPlastic: checkItemSchema
  },
  
  // ==================== 22. ACCESSORIES & TOOLS (6 fields) ====================
  accessoriesTools: {
    duplicateKeyCount: Number,
    remoteLockWorking: checkItemSchema,
    jack: checkItemSchema,
    handle: checkItemSchema,
    wheelWrench: checkItemSchema,
    towingToolTriangleToolkit: checkItemSchema,
    ownersManual: checkItemSchema
  },
  
  // ==================== PHOTOS (25 required photos) ====================
  photos: {
    front34: String, // S3 URL
    rear34: String,
    leftSide: String,
    rightSide: String,
    frontHeadOn: String,
    rearStraight: String,
    odometerIGNON: String,
    warningLampsCluster: String,
    vinEmbossingCloseUp: String,
    engineBay: String,
    lowerCrossMemberUnderBumper: String,
    apronLHPhoto: String,
    apronRHPhoto: String,
    chassisRailsUnderbody: String,
    bootFloorSpareWell: String,
    tyreLFCloseUp: String,
    tyreRFCloseUp: String,
    tyreLRCloseUp: String,
    tyreRRCloseUp: String,
    spareTyre: String,
    
    // Interior Photos
    dashboard: String,
    frontSeats: String,
    rearSeats: String,
    thirdRowSeats: String,
    roofHeader: String,
    doorPanelFR: String,
    doorPanelFL: String,
    doorPanelRR: String,
    doorPanelRL: String,
    sunroof: String,
    musicSystem: String,
    
    // Engine Detail
    engineOilFillerCap: String, // Mobil compartment
    
    damages: [String], // Multiple damage photos
    rcFront: String,
    insurance: String,
    puc: String
  },
  
  // ==================== FINAL ASSESSMENT ====================
  finalAssessment: {
    topPositives: [String], // 3-5 bullet points
    topIssues: [String], // 3-5 bullet points
    overallGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true
    },
    reconditioningEstimateLow: Number,
    reconditioningEstimateHigh: Number,
    
    // Category Ratings (0-10 scale)
    categoryRatings: {
      overallRating: { type: Number, min: 0, max: 10 },
      exteriorPanels: { type: Number, min: 0, max: 10 },
      interiorControls: { type: Number, min: 0, max: 10 },
      engine: { type: Number, min: 0, max: 10 },
      transmissionClutch: { type: Number, min: 0, max: 10 },
      steeringSuspension: { type: Number, min: 0, max: 10 },
      featuresEquipment: { type: Number, min: 0, max: 10 },
      warningLampsElectrical: { type: Number, min: 0, max: 10 },
      tyresWheels: { type: Number, min: 0, max: 10 },
      brakes: { type: Number, min: 0, max: 10 },
      structuralZones: { type: Number, min: 0, max: 10 }
    }
  },
  
  // ==================== CALCULATED FIELDS ====================
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // ==================== AUCTION INTEGRATION ====================
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

// Method to calculate overall score from category ratings
inspectionReportSchema.methods.calculateScore = function() {
  const ratings = this.finalAssessment?.categoryRatings
  if (!ratings) {
    this.overallScore = 0
    return 0
  }
  
  // Average of all 11 category ratings (0-10 scale) converted to 0-100
  const categories = [
    ratings.overallRating,
    ratings.exteriorPanels,
    ratings.interiorControls,
    ratings.engine,
    ratings.transmissionClutch,
    ratings.steeringSuspension,
    ratings.featuresEquipment,
    ratings.warningLampsElectrical,
    ratings.tyresWheels,
    ratings.brakes,
    ratings.structuralZones
  ]
  
  const validRatings = categories.filter(r => r !== undefined && r !== null)
  const avgRating = validRatings.length > 0 
    ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length 
    : 0
  
  this.overallScore = Math.round(avgRating * 10) // Convert 0-10 to 0-100
  return this.overallScore
}

// Indexes
inspectionReportSchema.index({ bookingId: 1 })
inspectionReportSchema.index({ overallScore: -1 })
inspectionReportSchema.index({ sentToAuction: 1 })
inspectionReportSchema.index({ 'vehicleInfo.registrationNo': 1 })
inspectionReportSchema.index({ inspectionDate: -1 })

const InspectionReport = mongoose.model('InspectionReport', inspectionReportSchema)

module.exports = InspectionReport
