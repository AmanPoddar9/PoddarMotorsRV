'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import ImageUpload from './ImageUpload'
import API_URL from '../../config/api'

// Reusable CheckItem Component
const CheckItem = ({ label, name, value, onChange, required = false }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex gap-4">
        {['Pass', 'Fail', 'Warning', 'N/A'].map((status) => (
          <label key={status} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={status}
              checked={value?.status === status}
              onChange={(e) => onChange({ status: e.target.value, notes: value?.notes || '' })}
              className="w-4 h-4"
            />
            <span className={`text-sm ${
              status === 'Pass' ? 'text-green-400' :
              status === 'Fail' ? 'text-red-400' :
              status === 'Warning' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {status}
            </span>
          </label>
        ))}
      </div>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={value?.notes || ''}
        onChange={(e) => onChange({ status: value?.status || 'N/A', notes: e.target.value })}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
      />
    </div>
  )
}


export default function CreateReportForm({ bookingIdProp, inspectorModeProp, tokenProp }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Priority: Props > SearchParams
  const bookingId = bookingIdProp || searchParams.get('bookingId')
  const inspectorMode = inspectorModeProp || searchParams.get('inspectorMode') === 'true'
  const inspectorToken = tokenProp || searchParams.get('token')
  
  const [currentStep, setCurrentStep] = useState(1)
  // ... rest of the component logic ...
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    bookingId: bookingId || '',
    inspectorName: '',
    inspectorID: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    
    // Vehicle Info
    vehicleInfo: {
      makeModelVariant: '',
      vinChassisNo: '',
      engineNo: '',
      registrationNo: '',
      fuelType:'' ,
      manufacturingYear: '',
      registrationYear: '',
      colour: '',
      carOdometer: '',
      transmission: '',
      ownershipNo: ''
    },
    
    // Documentation
    documentation: {},
    
    // Features
    features: {
      noOfAirbags: '',
      powerWindowsCount: '',
      parkingSensorsCount: ''
    },
    
    // Warning Lamps
    warningLamps: {
      chargingVoltageIdle: '',
      crankingVoltageMin: ''
    },
    
    // All other categories initialized as empty objects
    engine: {},
    transmission: {},
    suspensionSteering: {},
    tyresWheels: {
      tyreLFTread: '',
      tyreRFTread: '',
      tyreLRTread: '',
      tyreRRTread: '',
      tyreSpareTread: '',
      tyreLFDOT: '',
      tyreRFDOT: '',
      tyreLRDOT: '',
      tyreRRDOT: ''
    },
    brakes: {},
    bodyPanels: {},
    structuralIntegrity: {
      paintThickness: ''
    },
    paintGlass: {},
    exteriorLights: {},
    interiorControls: {
      // Functional Checks
      powerWindowsWorking: '',
      sunroofWorking: '',
      musicSystemWorking: '',
      
      // Seat Conditions
      driverSeatCondition: '',
      passengerSeatCondition: '',
      rearSeatCondition: '',
      thirdRowSeatCondition: '',
    },
    mirrorsWindowsWipers: {},
    latchesLocks: {},
    hvacPerformance: {
      ventTempAtIdle: '',
      ventTempAt1500rpm: ''
    },
    underbodyExhaust: {},
    drivelineAxles: {},
    roadTest: {},
    floodFireDetection: {},
    accessoriesTools: {
      duplicateKeyCount: ''
    },
    
    // Photos
    photos: {
      front34: '',
      rear34: '',
      leftSide: '',
      rightSide: '',
      frontHeadOn: '',
      rearStraight: '',
      odometerIGNON: '',
      warningLampsCluster: '',
      vinEmbossingCloseUp: '',
      engineBay: '',
      
      // Interior Photos (NEW)
      dashboard: '',
      frontSeats: '',
      rearSeats: '',
      thirdRowSeats: '',
      roofHeader: '',
      doorPanelFR: '',
      doorPanelFL: '',
      doorPanelRR: '',
      doorPanelRL: '',
      sunroof: '',
      musicSystem: '',
      
      engineOilFillerCap: '', // Mobil compartment
      
      lowerCrossMemberUnderBumper: '',
      apronLHPhoto: '',
      apronRHPhoto: '',
      chassisRailsUnderbody: '',
      bootFloorSpareWell: '',
      tyreLFCloseUp: '',
      tyreRFCloseUp: '',
      tyreLRCloseUp: '',
      tyreRRCloseUp: '',
      spareTyre: '',
      damages: [],
      rcFront: '',
      insurance: '',
      puc: ''
    },
    
    // Final Assessment
    finalAssessment: {
      topPositives: ['', '', ''],
      topIssues: ['', '', ''],
      overallGrade: '',
      reconditioningEstimateLow: '',
      reconditioningEstimateHigh: '',
      categoryRatings: {
        overallRating: 5,
        exteriorPanels: 5,
        interiorControls: 5,
        engine: 5,
        transmissionClutch: 5,
        steeringSuspension: 5,
        featuresEquipment: 5,
        warningLampsElectrical: 5,
        tyresWheels: 5,
        brakes: 5,
        structuralZones: 5
      }
    }
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Use inspector token if in inspector mode, otherwise use admin token
      const authToken = inspectorMode && inspectorToken ? inspectorToken : localStorage.getItem('token')
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add authentication header
      if (inspectorMode && inspectorToken) {
        // For inspector mode, send token as custom header for backend to validate
        headers['X-Inspector-Token'] = inspectorToken
      } else {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      const res = await fetch(`${API_URL}/api/inspections/reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        alert('Inspection report created successfully!')
        
        // Redirect based on mode
        if (inspectorMode) {
          // Show success message for inspector
          alert('Thank you! Your inspection report has been submitted successfully.')
          window.location.href = '/' // Redirect to home or thank you page
        } else {
          router.push(`/admin/inspections/report/${data.report._id}`)
        }
      } else {
        const error = await res.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Failed to create inspection report')
    } finally {
      setLoading(false)
    }
  }
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))
  
  const updateCheckItem = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }
  
  const updateField = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }
  
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Create Inspection Report</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Booking ID: <span className="text-white font-mono">{bookingId}</span>
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep} of 8
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info & Vehicle Details */}
          {currentStep === 1 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 1: Basic Information & Vehicle Details</h2>
              
              {/* Inspector Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Inspector Name *</label>
                  <input
                    type="text"
                    value={formData.inspectorName}
                    onChange={(e) => setFormData({...formData, inspectorName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Inspector ID</label>
                  <input
                    type="text"
                    value={formData.inspectorID}
                    onChange={(e) => setFormData({...formData, inspectorID: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Inspection Date *</label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Vehicle Information */}
              <h3 className="text-xl font-semibold text-white">Vehicle Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Make / Model / Variant *</label>
                  <input
                    type="text"
                    value={formData.vehicleInfo.makeModelVariant}
                    onChange={(e) => updateField('vehicleInfo', 'makeModelVariant', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="e.g., Maruti Swift VXI"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Registration No. *</label>
                  <input
                    type="text"
                    value={formData.vehicleInfo.registrationNo}
                    onChange={(e) => updateField('vehicleInfo', 'registrationNo', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white uppercase"
                    placeholder="MH01AB1234"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">VIN / Chassis No. *</label>
                  <input
                    type="text"
                    value={formData.vehicleInfo.vinChassisNo}
                    onChange={(e) => updateField('vehicleInfo', 'vinChassisNo', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Engine No. *</label>
                  <input
                    type="text"
                    value={formData.vehicleInfo.engineNo}
                    onChange={(e) => updateField('vehicleInfo', 'engineNo', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white uppercase"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Fuel Type *</label>
                  <select
                    value={formData.vehicleInfo.fuelType}
                    onChange={(e) => updateField('vehicleInfo', 'fuelType', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Transmission *</label>
                  <select
                    value={formData.vehicleInfo.transmission}
                    onChange={(e) => updateField('vehicleInfo', 'transmission', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="AMT">AMT</option>
                    <option value="CVT">CVT</option>
                    <option value="DCT">DCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Colour</label>
                  <input
                    type="text"
                    value={formData.vehicleInfo.colour}
                    onChange={(e) => updateField('vehicleInfo', 'colour', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Manufacturing Year *</label>
                  <input
                    type="number"
                    value={formData.vehicleInfo.manufacturingYear}
                    onChange={(e) => updateField('vehicleInfo', 'manufacturingYear', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    min="1990"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Registration Year</label>
                  <input
                    type="number"
                    value={formData.vehicleInfo.registrationYear}
                    onChange={(e) => updateField('vehicleInfo', 'registrationYear', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Ownership No.</label>
                  <input
                    type="number"
                    value={formData.vehicleInfo.ownershipNo}
                    onChange={(e) => updateField('vehicleInfo', 'ownershipNo', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    min="1"
                    max="9"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Odometer Reading (km) *</label>
                <input
                  type="number"
                  value={formData.vehicleInfo.carOdometer}
                  onChange={(e) => updateField('vehicleInfo', 'carOdometer', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="50000"
                  required
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Documentation - Will be added in next file due to length */}
          {currentStep === 2 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Step 2: Documentation Check</h2>
              <p className="text-gray-400 text-sm mb-6">Check all required documents and mark their status.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CheckItem label="RC Copy" name="rcCopy" value={formData.documentation.rcCopy} onChange={(val) => updateCheckItem('documentation', 'rcCopy', val)} required />
                <CheckItem label="Insurance Policy" name="insurancePolicy" value={formData.documentation.insurancePolicy} onChange={(val) => updateCheckItem('documentation', 'insurancePolicy', val)} required />
                <CheckItem label="Form 29" name="form29" value={formData.documentation.form29} onChange={(val) => updateCheckItem('documentation', 'form29', val)} />
                <CheckItem label="Form 30" name="form30" value={formData.documentation.form30} onChange={(val) => updateCheckItem('documentation', 'form30', val)} />
                <CheckItem label="Form 35 (HPA)" name="form35HPA" value={formData.documentation.form35HPA} onChange={(val) => updateCheckItem('documentation', 'form35HPA', val)} />
                <CheckItem label="NOC of HPA" name="nocOfHPA" value={formData.documentation.nocOfHPA} onChange={(val) => updateCheckItem('documentation', 'nocOfHPA', val)} />
                <CheckItem label="Original Road Tax Copy" name="originalRoadTaxCopy" value={formData.documentation.originalRoadTaxCopy} onChange={(val) => updateCheckItem('documentation', 'originalRoadTaxCopy', val)} />
                <CheckItem label="Old Registration Card" name="oldRegistrationCard" value={formData.documentation.oldRegistrationCard} onChange={(val) => updateCheckItem('documentation', 'oldRegistrationCard', val)} />
                <CheckItem label="GST Certificate" name="gstCertificate" value={formData.documentation.gstCertificate} onChange={(val) => updateCheckItem('documentation', 'gstCertificate', val)} />
                <CheckItem label="Service History" name="serviceHistory" value={formData.documentation.serviceHistory} onChange={(val) => updateCheckItem('documentation', 'serviceHistory', val)} />
                <CheckItem label="Sale Letter" name="saleLetter" value={formData.documentation.saleLetter} onChange={(val) => updateCheckItem('documentation', 'saleLetter', val)} />
                <CheckItem label="Tax Receipt" name="taxReceipt" value={formData.documentation.taxReceipt} onChange={(val) => updateCheckItem('documentation', 'taxReceipt', val)} />
                <CheckItem label="Aadhaar Card Copy" name="aadhaarCardCopy" value={formData.documentation.aadhaarCardCopy} onChange={(val) => updateCheckItem('documentation', 'aadhaarCardCopy', val)} />
                <CheckItem label="PAN Card Copy" name="panCardCopy" value={formData.documentation.panCardCopy} onChange={(val) => updateCheckItem('documentation', 'panCardCopy', val)} />
                <CheckItem label="Affidavit" name="affidavit" value={formData.documentation.affidavit} onChange={(val) => updateCheckItem('documentation', 'affidavit', val)} />
                <CheckItem label="PUC Certificate" name="pucCertificate" value={formData.documentation.pucCertificate} onChange={(val) => updateCheckItem('documentation', 'pucCertificate', val)} required />
                <CheckItem label="RC Condition" name="rcCondition" value={formData.documentation.rcCondition} onChange={(val) => updateCheckItem('documentation', 'rcCondition', val)} />
                <CheckItem label="RC Mismatch" name="rcMismatch" value={formData.documentation.rcMismatch} onChange={(val) => updateCheckItem('documentation', 'rcMismatch', val)} />
                <CheckItem label="Vehicle Flagged for Scrap?" name="vehicleFlaggedForScrap" value={formData.documentation.vehicleFlaggedForScrap} onChange={(val) => updateCheckItem('documentation', 'vehicleFlaggedForScrap', val)} />
                <CheckItem label="HPA NOC Received" name="hpaNocReceived" value={formData.documentation.hpaNocReceived} onChange={(val) => updateCheckItem('documentation', 'hpaNocReceived', val)} />
                <CheckItem label="On Road Fine/Challan Check" name="onRoadFineChallan" value={formData.documentation.onRoadFineChallan} onChange={(val) => updateCheckItem('documentation', 'onRoadFineChallan', val)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Fitness Upto (Date)</label>
                  <input
                    type="date"
                    value={formData.documentation.fitnessUpto || ''}
                    onChange={(e) => updateField('documentation', 'fitnessUpto', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Insurance Expiry Date</label>
                  <input
                    type="date"
                    value={formData.documentation.insuranceExpiryDate || ''}
                    onChange={(e) => updateField('documentation', 'insuranceExpiryDate', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Road Tax Valid Till</label>
                  <input
                    type="date"
                    value={formData.documentation.roadTaxValidTill || ''}
                    onChange={(e) => updateField('documentation', 'roadTaxValidTill', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Hypothecation Status</label>
                  <select
                    value={formData.documentation.hypothecationStatus || ''}
                    onChange={(e) => updateField('documentation', 'hypothecationStatus', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Insurance Type</label>
                  <select
                    value={formData.documentation.insuranceType || ''}
                    onChange={(e) => updateField('documentation', 'insuranceType', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="">Select</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Third Party">Third Party</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Features & Warning Lamps */}
          {currentStep === 3 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 3: Features & Warning Lamps</h2>
              
              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Features & Equipment</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">No. of Airbags</label>
                    <input
                      type="number"
                      value={formData.features.noOfAirbags}
                      onChange={(e) => updateField('features', 'noOfAirbags', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Power Windows (Count)</label>
                    <input
                      type="number"
                      value={formData.features.powerWindowsCount}
                      onChange={(e) => updateField('features', 'powerWindowsCount', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      min="0"
                      max="4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Parking Sensors (Count)</label>
                    <input
                      type="number"
                      value={formData.features.parkingSensorsCount}
                      onChange={(e) => updateField('features', 'parkingSensorsCount', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      min="0"
                      max="8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="ABS Present" name="absPresent" value={formData.features.absPresent} onChange={(val) => updateCheckItem('features', 'absPresent', val)} />
                  <CheckItem label="Rear Defogger" name="rearDefogger" value={formData.features.rearDefogger} onChange={(val) => updateCheckItem('features', 'rearDefogger', val)} />
                  <CheckItem label="Reverse Camera" name="reverseCamera" value={formData.features.reverseCamera} onChange={(val) => updateCheckItem('features', 'reverseCamera', val)} />
                  <CheckItem label="Sunroof" name="sunroof" value={formData.features.sunroof} onChange={(val) => updateCheckItem('features', 'sunroof', val)} />
                  <CheckItem label="Cruise Control" name="cruiseControl" value={formData.features.cruiseControl} onChange={(val) => updateCheckItem('features', 'cruiseControl', val)} />
                  <CheckItem label="ESP / ESC" name="espEsc" value={formData.features.espEsc} onChange={(val) => updateCheckItem('features', 'espEsc', val)} />
                  <CheckItem label="TPMS" name="tpms" value={formData.features.tpms} onChange={(val) => updateCheckItem('features', 'tpms', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add more feature check items as needed using the same pattern</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Warning Lamps */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Warning Lamps & Diagnostics</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Charging Voltage (idle)</label>
                    <input
                      type="text"
                      value={formData.warningLamps.chargingVoltageIdle}
                      onChange={(e) => updateField('warningLamps', 'chargingVoltageIdle', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="14.2V"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Cranking Voltage (min)</label>
                    <input
                      type="text"
                      value={formData.warningLamps.crankingVoltageMin}
                      onChange={(e) => updateField('warningLamps', 'crankingVoltageMin', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="10.5V"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Engine MIL" name="engineMIL" value={formData.warningLamps.engineMIL} onChange={(val) => updateCheckItem('warningLamps', 'engineMIL', val)} />
                  <CheckItem label="ABS Light" name="absLight" value={formData.warningLamps.absLight} onChange={(val) => updateCheckItem('warningLamps', 'absLight', val)} />
                  <CheckItem label="Airbag Light" name="airbagLight" value={formData.warningLamps.airbagLight} onChange={(val) => updateCheckItem('warningLamps', 'airbagLight', val)} />
                  <CheckItem label="Oil Pressure Light" name="oilPressureLight" value={formData.warningLamps.oilPressureLight} onChange={(val) => updateCheckItem('warningLamps', 'oilPressureLight', val)} />
                  <CheckItem label="Temperature Light" name="temperatureLight" value={formData.warningLamps.temperatureLight} onChange={(val) => updateCheckItem('warningLamps', 'temperatureLight', val)} />
                  <CheckItem label="Battery/Charging Light" name="batteryChargingLight" value={formData.warningLamps.batteryChargingLight} onChange={(val) => updateCheckItem('warningLamps', 'batteryChargingLight', val)} />
                  <CheckItem label="EPS Light" name="epsLight" value={formData.warningLamps.epsLight} onChange={(val) => updateCheckItem('warningLamps', 'epsLight', val)} />
                  <CheckItem label="TPMS Light" name="tpmsLight" value={formData.warningLamps.tpmsLight} onChange={(val) => updateCheckItem('warningLamps', 'tpmsLight', val)} />
                  <CheckItem label="SVHS/Hybrid Light" name="svhsHybridLight" value={formData.warningLamps.svhsHybridLight} onChange={(val) => updateCheckItem('warningLamps', 'svhsHybridLight', val)} />
                  <CheckItem label="Brake Warning" name="brakeWarning" value={formData.warningLamps.brakeWarning} onChange={(val) => updateCheckItem('warningLamps', 'brakeWarning', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add more warning lamp checks as needed</p>
              </div>
            </div>
          )}
          
          {/* Step 4: Mechanical Inspection */}
          {currentStep === 4 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 4: Mechanical Inspection</h2>
              <p className="text-gray-400 text-sm">Check engine, transmission, suspension, steering, and brakes.</p>
              
              {/* Engine */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Engine & Powertrain</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Engine Sound" name="engineSound" value={formData.engine.engineSound} onChange={(val) => updateCheckItem('engine', 'engineSound', val)} />
                  <CheckItem label="Blow-by" name="blowBy" value={formData.engine.blowBy} onChange={(val) => updateCheckItem('engine', 'blowBy', val)} />
                  <CheckItem label="Exhaust Smoke (Blue/Black/White)" name="exhaustSmoke" value={formData.engine.exhaustSmoke} onChange={(val) => updateCheckItem('engine', 'exhaustSmoke', val)} />
                  <CheckItem label="Oil Filler Cap (Sludge?)" name="engineOilFillerCapCondition" value={formData.engine.engineOilFillerCapCondition} onChange={(val) => updateCheckItem('engine', 'engineOilFillerCapCondition', val)} />
                  <CheckItem label="Engine Oil Leaking" name="engineOilLeaking" value={formData.engine.engineOilLeaking} onChange={(val) => updateCheckItem('engine', 'engineOilLeaking', val)} />
                  <CheckItem label="Coolant Level" name="coolantLevel" value={formData.engine.coolantLevel} onChange={(val) => updateCheckItem('engine', 'coolantLevel', val)} />
                  <CheckItem label="Turbo Condition" name="turboCondition" value={formData.engine.turboCondition} onChange={(val) => updateCheckItem('engine', 'turboCondition', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Injector Noise, Timing Belt, Piston Noise, Oil Seals, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Transmission */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Transmission & Clutch</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="1st Gear Shift" name="gear1Shift" value={formData.transmission.gear1Shift} onChange={(val) => updateCheckItem('transmission', 'gear1Shift', val)} />
                  <CheckItem label="2nd Gear Shift" name="gear2Shift" value={formData.transmission.gear2Shift} onChange={(val) => updateCheckItem('transmission', 'gear2Shift', val)} />
                  <CheckItem label="3rd Gear Shift" name="gear3Shift" value={formData.transmission.gear3Shift} onChange={(val) => updateCheckItem('transmission', 'gear3Shift', val)} />
                  <CheckItem label="Clutch Plate" name="clutchPlate" value={formData.transmission.clutchPlate} onChange={(val) => updateCheckItem('transmission', 'clutchPlate', val)} />
                  <CheckItem label="Pressure Plate" name="pressurePlate" value={formData.transmission.pressurePlate} onChange={(val) => updateCheckItem('transmission', 'pressurePlate', val)} />
                  <CheckItem label="Clutch Slip Under Load" name="clutchSlipUnderLoad" value={formData.transmission.clutchSlipUnderLoad} onChange={(val) => updateCheckItem('transmission', 'clutchSlipUnderLoad', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: 4th/5th/Reverse gears, Release Bearing, Clutch Bite Point, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Suspension & Steering */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Suspension & Steering</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Overall Suspension" name="overallSuspension" value={formData.suspensionSteering.overallSuspension} onChange={(val) => updateCheckItem('suspensionSteering', 'overallSuspension', val)} />
                  <CheckItem label="Ball Joints" name="ballJoints" value={formData.suspensionSteering.ballJoints} onChange={(val) => updateCheckItem('suspensionSteering', 'ballJoints', val)} />
                  <CheckItem label="Rack & Pinion" name="rackPinionPlayBootTear" value={formData.suspensionSteering.rackPinionPlayBootTear} onChange={(val) => updateCheckItem('suspensionSteering', 'rackPinionPlayBootTear', val)} />
                  <CheckItem label="Front RH Shock" name="frontRHShockAbsorber" value={formData.suspensionSteering.frontRHShockAbsorber} onChange={(val) => updateCheckItem('suspensionSteering', 'frontRHShockAbsorber', val)} />
                  <CheckItem label="Front LH Shock" name="frontLHShockAbsorber" value={formData.suspensionSteering.frontLHShockAbsorber} onChange={(val) => updateCheckItem('suspensionSteering', 'frontLHShockAbsorber', val)} />
                  <CheckItem label="Power Steering Motor" name="powerSteeringMotorEPS" value={formData.suspensionSteering.powerSteeringMotorEPS} onChange={(val) => updateCheckItem('suspensionSteering', 'powerSteeringMotorEPS', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Rear shocks, Tie rods, Engine mounts, Lower/Upper arms, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Brakes */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Brakes</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Overall Brakes" name="overallBrakes" value={formData.brakes.overallBrakes} onChange={(val) => updateCheckItem('brakes', 'overallBrakes', val)} />
                  <CheckItem label="Front RH Disc" name="frontRHDisc" value={formData.brakes.frontRHDisc} onChange={(val) => updateCheckItem('brakes', 'frontRHDisc', val)} />
                  <CheckItem label="Front LH Disc" name="frontLHDisc" value={formData.brakes.frontLHDisc} onChange={(val) => updateCheckItem('brakes', 'frontLHDisc', val)} />
                  <CheckItem label="Calipers" name="calipers" value={formData.brakes.calipers} onChange={(val) => updateCheckItem('brakes', 'calipers', val)} />
                  <CheckItem label="Brake Oil Level" name="brakeOilLevel" value={formData.brakes.brakeOilLevel} onChange={(val) => updateCheckItem('brakes', 'brakeOilLevel', val)} />
                  <CheckItem label="Handbrake" name="handbrakeLever" value={formData.brakes.handbrakeLever} onChange={(val) => updateCheckItem('brakes', 'handbrakeLever', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Rear brakes, Brake shoes, Drums, Handbrake cables, Vibration, etc.</p>
              </div>
            </div>
          )}
          
          {/* Step 5: Body & Structure */}
          {currentStep === 5 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 5: Body & Structure</h2>
              <p className="text-gray-400 text-sm">Check body panels, structural integrity, paint, and glass.</p>
              
              {/* Body Panels */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Body Panels</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Bonnet" name="bonnet" value={formData.bodyPanels.bonnet} onChange={(val) => updateCheckItem('bodyPanels', 'bonnet', val)} />
                  <CheckItem label="Front Bumper" name="frontBumper" value={formData.bodyPanels.frontBumper} onChange={(val) => updateCheckItem('bodyPanels', 'frontBumper', val)} />
                  <CheckItem label="Rear Bumper" name="rearBumper" value={formData.bodyPanels.rearBumper} onChange={(val) => updateCheckItem('bodyPanels', 'rearBumper', val)} />
                  <CheckItem label="RH Fender" name="rhFender" value={formData.bodyPanels.rhFender} onChange={(val) => updateCheckItem('bodyPanels', 'rhFender', val)} />
                  <CheckItem label="LH Fender" name="lhFender" value={formData.bodyPanels.lhFender} onChange={(val) => updateCheckItem('bodyPanels', 'lhFender', val)} />
                  <CheckItem label="Roof Condition" name="roofCondition" value={formData.bodyPanels.roofCondition} onChange={(val) => updateCheckItem('bodyPanels', 'roofCondition', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: All 4 doors, Running boards, Quarter panels, Boot/Dicky</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Structural Integrity */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Structural Integrity</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Chassis" name="chassis" value={formData.structuralIntegrity.chassis} onChange={(val) => updateCheckItem('structuralIntegrity', 'chassis', val)} />
                  <CheckItem label="A/B/C Pillars" name="abcPillars" value={formData.structuralIntegrity.abcPillars} onChange={(val) => updateCheckItem('structuralIntegrity', 'abcPillars', val)} />
                  <CheckItem label="Floor Pan" name="floorPan" value={formData.structuralIntegrity.floorPan} onChange={(val) => updateCheckItem('structuralIntegrity', 'floorPan', val)} />
                  <CheckItem label="Apron LH" name="apronLH" value={formData.structuralIntegrity.apronLH} onChange={(val) => updateCheckItem('structuralIntegrity', 'apronLH', val)} />
                  <CheckItem label="Apron RH" name="apronRH" value={formData.structuralIntegrity.apronRH} onChange={(val) => updateCheckItem('structuralIntegrity', 'apronRH', val)} />
                  <CheckItem label="Weld Pasting/Joints" name="weldPastingJoints" value={formData.structuralIntegrity.weldPastingJoints} onChange={(val) => updateCheckItem('structuralIntegrity', 'weldPastingJoints', val)} />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Paint Thickness (selected panels)</label>
                  <input
                    type="text"
                    value={formData.structuralIntegrity.paintThickness}
                    onChange={(e) => updateField('structuralIntegrity', 'paintThickness', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="e.g., 100-120 microns"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Cross-members, Radiator support, Cowl, Firewall, Boot floor, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Paint & Glass */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Paint & Glass</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Front Windshield" name="frontWindshield" value={formData.paintGlass.frontWindshield} onChange={(val) => updateCheckItem('paintGlass', 'frontWindshield', val)} />
                  <CheckItem label="Rear Windshield" name="rearWindshield" value={formData.paintGlass.rearWindshield} onChange={(val) => updateCheckItem('paintGlass', 'rearWindshield', val)} />
                  <CheckItem label="Front RH Door Glass" name="frontRHDoorGlass" value={formData.paintGlass.frontRHDoorGlass} onChange={(val) => updateCheckItem('paintGlass', 'frontRHDoorGlass', val)} />
                  <CheckItem label="Front LH Door Glass" name="frontLHDoorGlass" value={formData.paintGlass.frontLHDoorGlass} onChange={(val) => updateCheckItem('paintGlass', 'frontLHDoorGlass', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Rear door glass, Quarter glass</p>
              </div>
            </div>
          )}
          
          {/* Step 6: Electrical & Interior */}
          {currentStep === 6 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 6: Electrical & Interior</h2>
              <p className="text-gray-400 text-sm">Check all lights, interior components, HVAC, and controls.</p>
              
              {/* Exterior Lights */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Exterior Lights</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="RH Headlamp" name="rhHeadlamp" value={formData.exteriorLights.rhHeadlamp} onChange={(val) => updateCheckItem('exteriorLights', 'rhHeadlamp', val)} />
                  <CheckItem label="LH Headlamp" name="lhHeadlamp" value={formData.exteriorLights.lhHeadlamp} onChange={(val) => updateCheckItem('exteriorLights', 'lhHeadlamp', val)} />
                  <CheckItem label="RH Tail Lamp" name="rhTailLamp" value={formData.exteriorLights.rhTailLamp} onChange={(val) => updateCheckItem('exteriorLights', 'rhTailLamp', val)} />
                  <CheckItem label="LH Tail Lamp" name="lhTailLamp" value={formData.exteriorLights.lhTailLamp} onChange={(val) => updateCheckItem('exteriorLights', 'lhTailLamp', val)} />
                  <CheckItem label="DRLs" name="drls" value={formData.exteriorLights.drls} onChange={(val) => updateCheckItem('exteriorLights', 'drls', val)} />
                  <CheckItem label="Hazard Lamps" name="hazardLamps" value={formData.exteriorLights.hazardLamps} onChange={(val) => updateCheckItem('exteriorLights', 'hazardLamps', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Fog lamps, Indicators, Number plate lamp, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Interior & Controls */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Interior & Controls</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Dashboard" name="dashboard" value={formData.interiorControls.dashboard} onChange={(val) => updateCheckItem('interiorControls', 'dashboard', val)} />
                  <CheckItem label="Seat Belts (all)" name="seatBeltsAll" value={formData.interiorControls.seatBeltsAll} onChange={(val) => updateCheckItem('interiorControls', 'seatBeltsAll', val)} />
                  <CheckItem label="Music System" name="musicSystem" value={formData.interiorControls.musicSystem} onChange={(val) => updateCheckItem('interiorControls', 'musicSystem', val)} />
                  <CheckItem label="AC Knob/Regulator" name="acKnobRegulator" value={formData.interiorControls.acKnobRegulator} onChange={(val) => updateCheckItem('interiorControls', 'acKnobRegulator', val)} />
                  <CheckItem label="Headliner/Ceiling" name="headlinerCeilingCondition" value={formData.interiorControls.headlinerCeilingCondition} onChange={(val) => updateCheckItem('interiorControls', 'headlinerCeilingCondition', val)} />
                  
                  {/* Detailed Seat Conditions */}
                  <CheckItem label="Driver Seat" name="driverSeatCondition" value={formData.interiorControls.driverSeatCondition} onChange={(val) => updateCheckItem('interiorControls', 'driverSeatCondition', val)} />
                  <CheckItem label="Passenger Seat" name="passengerSeatCondition" value={formData.interiorControls.passengerSeatCondition} onChange={(val) => updateCheckItem('interiorControls', 'passengerSeatCondition', val)} />
                  <CheckItem label="Rear Seat Bench" name="rearSeatCondition" value={formData.interiorControls.rearSeatCondition} onChange={(val) => updateCheckItem('interiorControls', 'rearSeatCondition', val)} />
                  <CheckItem label="3rd Row Seats" name="thirdRowSeatCondition" value={formData.interiorControls.thirdRowSeatCondition} onChange={(val) => updateCheckItem('interiorControls', 'thirdRowSeatCondition', val)} />
                  
                  {/* Functional Checks */}
                  <CheckItem label="Power Windows Working" name="powerWindowsWorking" value={formData.interiorControls.powerWindowsWorking} onChange={(val) => updateCheckItem('interiorControls', 'powerWindowsWorking', val)} required />
                  <CheckItem label="Sunroof Working" name="sunroofWorking" value={formData.interiorControls.sunroofWorking} onChange={(val) => updateCheckItem('interiorControls', 'sunroofWorking', val)} />
                  <CheckItem label="Music System Working" name="musicSystemWorking" value={formData.interiorControls.musicSystemWorking} onChange={(val) => updateCheckItem('interiorControls', 'musicSystemWorking', val)} />
                  
                  {/* Added missing interior fields */}
                  <CheckItem label="Door Pads" name="doorPads" value={formData.interiorControls.doorPads} onChange={(val) => updateCheckItem('interiorControls', 'doorPads', val)} />
                  <CheckItem label="Door Inner Panels" name="doorInnerPanels" value={formData.interiorControls.doorInnerPanels} onChange={(val) => updateCheckItem('interiorControls', 'doorInnerPanels', val)} />
                  <CheckItem label="Seat Covers/Upholstery" name="seatCovers" value={formData.interiorControls.seatCovers} onChange={(val) => updateCheckItem('interiorControls', 'seatCovers', val)} />
                  <CheckItem label="Seat Incline/Decline" name="seatInclineDecline" value={formData.interiorControls.seatInclineDecline} onChange={(val) => updateCheckItem('interiorControls', 'seatInclineDecline', val)} />
                  <CheckItem label="Seat Slider" name="seatSlider" value={formData.interiorControls.seatSlider} onChange={(val) => updateCheckItem('interiorControls', 'seatSlider', val)} />
                  <CheckItem label="Floor Mats" name="floorMats" value={formData.interiorControls.floorMats} onChange={(val) => updateCheckItem('interiorControls', 'floorMats', val)} />
                  <CheckItem label="Steering Wheel Cover" name="steeringWheelCover" value={formData.interiorControls.steeringWheelCover} onChange={(val) => updateCheckItem('interiorControls', 'steeringWheelCover', val)} />
                  <CheckItem label="AC Grills/Vents" name="acGrillsVents" value={formData.interiorControls.acGrillsVents} onChange={(val) => updateCheckItem('interiorControls', 'acGrillsVents', val)} />
                  <CheckItem label="Ceiling Lights" name="ceilingLights" value={formData.interiorControls.ceilingLights} onChange={(val) => updateCheckItem('interiorControls', 'ceilingLights', val)} />
                  <CheckItem label="Windshield Frame" name="windshieldFrame" value={formData.interiorControls.windshieldFrame} onChange={(val) => updateCheckItem('interiorControls', 'windshieldFrame', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Seat covers, Door pads, Floor mats, Steering wheel, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* HVAC */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">HVAC Performance</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Vent Temp at Idle (°C)</label>
                    <input
                      type="text"
                      value={formData.hvacPerformance.ventTempAtIdle}
                      onChange={(e) => updateField('hvacPerformance', 'ventTempAtIdle', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="8°C"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Vent Temp at 1500 rpm (°C)</label>
                    <input
                      type="text"
                      value={formData.hvacPerformance.ventTempAt1500rpm}
                      onChange={(e) => updateField('hvacPerformance', 'ventTempAt1500rpm', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="6°C"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="AC Compressor" name="acCompressor" value={formData.hvacPerformance.acCompressor} onChange={(val) => updateCheckItem('hvacPerformance', 'acCompressor', val)} />
                  <CheckItem label="Blower" name="blower" value={formData.hvacPerformance.blower} onChange={(val) => updateCheckItem('hvacPerformance', 'blower', val)} />
                  <CheckItem label="Refrigerant Level" name="refrigerantGasLevel" value={formData.hvacPerformance.refrigerantGasLevel} onChange={(val) => updateCheckItem('hvacPerformance', 'refrigerantGasLevel', val)} />
                  <CheckItem label="Condenser Cleanliness" name="condenserGrillCleanliness" value={formData.hvacPerformance.condenserGrillCleanliness} onChange={(val) => updateCheckItem('hvacPerformance', 'condenserGrillCleanliness', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: AC belt, Pipes, Mode flaps, etc.</p>
              </div>
            </div>
          )}
          
          {/* Step 7: Underbody, Tyres & Road Test */}
          {currentStep === 7 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 7: Underbody, Tyres & Road Test</h2>
              <p className="text-gray-400 text-sm">Check tyres, underbody, driveline, and perform road test.</p>
              
              {/* Tyres */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Tyres & Wheels</h3>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">LF Tread (mm)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreLFTread}
                      onChange={(e) => updateField('tyresWheels', 'tyreLFTread', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="5.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">RF Tread (mm)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreRFTread}
                      onChange={(e) => updateField('tyresWheels', 'tyreRFTread', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="5.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">LR Tread (mm)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreLRTread}
                      onChange={(e) => updateField('tyresWheels', 'tyreLRTread', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="5.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">RR Tread (mm)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreRRTread}
                      onChange={(e) => updateField('tyresWheels', 'tyreRRTread', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="5.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Spare Tread (mm)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreSpareTread}
                      onChange={(e) => updateField('tyresWheels', 'tyreSpareTread', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="7.0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">LF DOT (week-year)</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreLFDOT}
                      onChange={(e) => updateField('tyresWheels', 'tyreLFDOT', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="15-2022"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">RF DOT</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreRFDOT}
                      onChange={(e) => updateField('tyresWheels', 'tyreRFDOT', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="15-2022"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">LR DOT</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreLRDOT}
                      onChange={(e) => updateField('tyresWheels', 'tyreLRDOT', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="15-2022"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">RR DOT</label>
                    <input
                      type="text"
                      value={formData.tyresWheels.tyreRRDOT}
                      onChange={(e) => updateField('tyresWheels', 'tyreRRDOT', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="15-2022"
                    />
                  </div>
                </div>
                <CheckItem label="Alloy/Wheel Damage" name="alloyWheelDamage" value={formData.tyresWheels.alloyWheelDamage} onChange={(val) => updateCheckItem('tyresWheels', 'alloyWheelDamage', val)} />
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Underbody */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Underbody & Exhaust</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Subframe Bent/Impact" name="subframeBentImpact" value={formData.underbodyExhaust.subframeBentImpact} onChange={(val) => updateCheckItem('underbodyExhaust', 'subframeBentImpact', val)} />
                  <CheckItem label="Exhaust Leaks" name="exhaustLeaks" value={formData.underbodyExhaust.exhaustLeaks} onChange={(val) => updateCheckItem('underbodyExhaust', 'exhaustLeaks', val)} />
                  <CheckItem label="Catalyst/DPF Intact" name="catalystDPFIntact" value={formData.underbodyExhaust.catalystDPFIntact} onChange={(val) => updateCheckItem('underbodyExhaust', 'catalystDPFIntact', val)} />
                  <CheckItem label="Oil Leaks (underbody)" name="oilLeaksUnderbody" value={formData.underbodyExhaust.oilLeaksUnderbody} onChange={(val) => updateCheckItem('underbodyExhaust', 'oilLeaksUnderbody', val)} />
                  <CheckItem label="Rust (underbody)" name="rustUnderbody" value={formData.underbodyExhaust.rustUnderbody} onChange={(val) => updateCheckItem('underbodyExhaust', 'rustUnderbody', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Gearbox leaks, Brake/Fuel lines, Heat shields, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Driveline */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Driveline & Axles</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="FR RH Wheel Bearing" name="frRHWheelBearing" value={formData.drivelineAxles.frRHWheelBearing} onChange={(val) => updateCheckItem('drivelineAxles', 'frRHWheelBearing', val)} />
                  <CheckItem label="FR LH Wheel Bearing" name="frLHWheelBearing" value={formData.drivelineAxles.frLHWheelBearing} onChange={(val) => updateCheckItem('drivelineAxles', 'frLHWheelBearing', val)} />
                  <CheckItem label="Propeller Shaft/CV Boots" name="propellerShaftCVBoots" value={formData.drivelineAxles.propellerShaftCVBoots} onChange={(val) => updateCheckItem('drivelineAxles', 'propellerShaftCVBoots', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Rear bearings, Axle oil seals, Strut bearings, etc.</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Road Test */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Road Test</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Straight-line Pull" name="straightLinePull" value={formData.roadTest.straightLinePull} onChange={(val) => updateCheckItem('roadTest', 'straightLinePull', val)} />
                  <CheckItem label="Steering On-Centre" name="steeringOnCentre" value={formData.roadTest.steeringOnCentre} onChange={(val) => updateCheckItem('roadTest', 'steeringOnCentre', val)} />
                  <CheckItem label="Vibration at 40 km/h" name="vibrationAt40" value={formData.roadTest.vibrationAt40} onChange={(val) => updateCheckItem('roadTest', 'vibrationAt40', val)} />
                  <CheckItem label="Vibration at 60 km/h" name="vibrationAt60" value={formData.roadTest.vibrationAt60} onChange={(val) => updateCheckItem('roadTest', 'vibrationAt60', val)} />
                  <CheckItem label="Brake Shudder" name="brakeShudder" value={formData.roadTest.brakeShudder} onChange={(val) => updateCheckItem('roadTest', 'brakeShudder', val)} />
                  <CheckItem label="Suspension Knocks" name="suspensionKnocks" value={formData.roadTest.suspensionKnocks} onChange={(val) => updateCheckItem('roadTest', 'suspensionKnocks', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Vibration@80, Turbo whistle, AC effectiveness while driving</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Flood/Fire Detection */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Flood/Fire Detection</h3>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Water Line Marks" name="waterLineMarks" value={formData.floodFireDetection.waterLineMarks} onChange={(val) => updateCheckItem('floodFireDetection', 'waterLineMarks', val)} />
                  <CheckItem label="Silt Under Carpets" name="siltUnderCarpets" value={formData.floodFireDetection.siltUnderCarpets} onChange={(val) => updateCheckItem('floodFireDetection', 'siltUnderCarpets', val)} />
                  <CheckItem label="Musty Smell" name="mustySmell" value={formData.floodFireDetection.mustySmell} onChange={(val) => updateCheckItem('floodFireDetection', 'mustySmell', val)} />
                  <CheckItem label="Burnt Wiring/Plastic" name="burntWiringPlastic" value={formData.floodFireDetection.burntWiringPlastic} onChange={(val) => updateCheckItem('floodFireDetection', 'burntWiringPlastic', val)} />
                </div>
                <p className="text-sm text-gray-400 mt-2">💡 Add: Seat anchor corrosion, Connector oxidation</p>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Accessories */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Accessories & Tools</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Duplicate Key Count</label>
                  <input
                    type="number"
                    value={formData.accessoriesTools.duplicateKeyCount}
                    onChange={(e) => updateField('accessoriesTools', 'duplicateKeyCount', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    min="0"
                    max="5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CheckItem label="Remote Lock Working" name="remoteLockWorking" value={formData.accessoriesTools.remoteLockWorking} onChange={(val) => updateCheckItem('accessoriesTools', 'remoteLockWorking', val)} />
                  <CheckItem label="Jack" name="jack" value={formData.accessoriesTools.jack} onChange={(val) => updateCheckItem('accessoriesTools', 'jack', val)} />
                  <CheckItem label="Wheel Wrench" name="wheelWrench" value={formData.accessoriesTools.wheelWrench} onChange={(val) => updateCheckItem('accessoriesTools', 'wheelWrench', val)} />
                  <CheckItem label="Owner's Manual" name="ownersManual" value={formData.accessoriesTools.ownersManual} onChange={(val) => updateCheckItem('accessoriesTools', 'ownersManual', val)} />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 8: Photos & Final Assessment */}
          {currentStep === 8 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 8: Photos & Final Assessment</h2>
              
              {/* Photo Uploads */}
              {/* Photo Uploads */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">required Photos (25 total)</h3>
                
                {/* Main Photos Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    // Exterior
                    { key: 'front34', label: 'Front 3/4 View' },
                    { key: 'rear34', label: 'Rear 3/4 View' },
                    { key: 'leftSide', label: 'Left Side' },
                    { key: 'rightSide', label: 'Right Side' },
                    { key: 'frontHeadOn', label: 'Front Head On' },
                    { key: 'rearStraight', label: 'Rear Straight' },
                    
                    // Interior & Features
                    { key: 'dashboard', label: 'Dashboard View' },
                    { key: 'frontSeats', label: 'Front Seats' },
                    { key: 'rearSeats', label: 'Rear Seats' },
                    { key: 'thirdRowSeats', label: '3rd Row Seats (if any)' },
                    { key: 'doorPanelFR', label: 'Door Panel Front Right' },
                    { key: 'doorPanelFL', label: 'Door Panel Front Left' },
                    { key: 'doorPanelRR', label: 'Door Panel Rear Right' },
                    { key: 'doorPanelRL', label: 'Door Panel Rear Left' },
                    { key: 'roofHeader', label: 'Roof / Headliner' },
                    { key: 'sunroof', label: 'Sunroof' },
                    { key: 'musicSystem', label: 'Music System' },
                    
                    // Detail Close-ups
                    { key: 'odometerIGNON', label: 'Odometer (IGN ON)' },
                    { key: 'warningLampsCluster', label: 'Warning Lamps Cluster' },
                    { key: 'vinEmbossingCloseUp', label: 'VIN Embossing' },
                    { key: 'engineBay', label: 'Engine Bay' },
                    { key: 'engineOilFillerCap', label: 'Oil Filler Cap' },
                    { key: 'bootFloorSpareWell', label: 'Boot Floor / Spare Well' },
                    
                    // Undercarriage
                    { key: 'lowerCrossMemberUnderBumper', label: 'Lower Cross Member' },
                    { key: 'apronLHPhoto', label: 'Apron LH' },
                    { key: 'apronRHPhoto', label: 'Apron RH' },
                    { key: 'chassisRailsUnderbody', label: 'Chassis Rails' },
                    
                    // Tyres
                    { key: 'tyreLFCloseUp', label: 'Tyre LF' },
                    { key: 'tyreRFCloseUp', label: 'Tyre RF' },
                    { key: 'tyreLRCloseUp', label: 'Tyre LR' },
                    { key: 'tyreRRCloseUp', label: 'Tyre RR' },
                    { key: 'spareTyre', label: 'Spare Tyre' },
                    
                    // Documents
                    { key: 'rcFront', label: 'RC Front' },
                    { key: 'insurance', label: 'Insurance' },
                    { key: 'puc', label: 'PUC Certificate' },
                  ].map((photo) => (
                    <div key={photo.key} className="bg-gray-700/50 p-3 rounded-lg">
                      <label className="block text-sm text-gray-300 mb-2 font-medium">{photo.label}</label>
                      <ImageUpload 
                        maxImages={1}
                        onImagesChange={(urls) => updateField('photos', photo.key, urls[0] || '')}
                      />
                      {formData.photos[photo.key] && (
                        <div className="mt-2 relative aspect-video rounded overflow-hidden">
                          <img 
                            src={formData.photos[photo.key]} 
                            alt={photo.label}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <hr className="border-gray-700" />
                
                {/* Damages - Multi-upload */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Damage Photos</h3>
                  <p className="text-gray-400 text-sm mb-4">Upload multiple photos of scratches, dents, or other issues.</p>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <ImageUpload 
                      maxImages={10}
                      onImagesChange={(urls) => {
                        // Append new URLs to existing damages array
                        const currentDamages = Array.isArray(formData.photos.damages) ? formData.photos.damages : [];
                        // Check if we need to merge or replace. 
                        // ImageUpload usually returns the full new list if it manages state, or just new files?
                        // Looking at ImageUpload.jsx: `const newImages = [...images, ...data.urls]; handleUpload(newImages)`
                        // So it returns the FULL list of images maintained by that component instance.
                        // We should map that to our form field.
                        updateField('photos', 'damages', urls)
                      }}
                    />
                    
                    {/* Display uploaded damage photos if outside ImageUpload component's preview */}
                    {Array.isArray(formData.photos?.damages) && formData.photos.damages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {formData.photos.damages.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded overflow-hidden border border-gray-600">
                             <img src={url} alt={`Damage ${i+1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <hr className="border-gray-700" />
              
              {/* Final Assessment */}
              <h3 className="text-xl font-semibold text-white">Final Assessment</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Top Positives (3-5 bullets)</label>
                {formData.finalAssessment.topPositives.map((pos, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={pos}
                    onChange={(e) => {
                      const newPositives = [...formData.finalAssessment.topPositives]
                      newPositives[idx] = e.target.value
                      updateField('finalAssessment', 'topPositives', newPositives)
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-2"
                    placeholder={`Positive point ${idx + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newPositives = [...formData.finalAssessment.topPositives, '']
                    updateField('finalAssessment', 'topPositives', newPositives)
                  }}
                  className="text-blue-400 text-sm hover:text-blue-300"
                >
                  + Add another positive
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Top Issues (3-5 bullets)</label>
                {formData.finalAssessment.topIssues.map((issue, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={issue}
                    onChange={(e) => {
                      const newIssues = [...formData.finalAssessment.topIssues]
                      newIssues[idx] = e.target.value
                      updateField('finalAssessment', 'topIssues', newIssues)
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-2"
                    placeholder={`Issue ${idx + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newIssues = [...formData.finalAssessment.topIssues, '']
                    updateField('finalAssessment', 'topIssues', newIssues)
                  }}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  + Add another issue
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Overall Grade *</label>
                  <select
                    value={formData.finalAssessment.overallGrade}
                    onChange={(e) => updateField('finalAssessment', 'overallGrade', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Good</option>
                    <option value="C">C - Fair</option>
                    <option value="D">D - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Reconditioning Estimate (Low)</label>
                  <input
                    type="number"
                    value={formData.finalAssessment.reconditioningEstimateLow}
                    onChange={(e) => updateField('finalAssessment', 'reconditioningEstimateLow', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="₹10,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Reconditioning Estimate (High)</label>
                  <input
                    type="number"
                    value={formData.finalAssessment.reconditioningEstimateHigh}
                    onChange={(e) => updateField('finalAssessment', 'reconditioningEstimateHigh', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="₹20,000"
                  />
                </div>
              </div>
              
              {/* Category Ratings (0-10 sliders) */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Category Ratings (0-10 scale)</h4>
                {Object.keys(formData.finalAssessment.categoryRatings).map((category) => (
                  <div key={category}>
                    <label className="block text-sm text-gray-300 mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}: {formData.finalAssessment.categoryRatings[category]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.finalAssessment.categoryRatings[category]}
                      onChange={(e) => {
                        const newRatings = { ...formData.finalAssessment.categoryRatings }
                        newRatings[category] = parseInt(e.target.value)
                        updateField('finalAssessment', 'categoryRatings', newRatings)
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                ← Previous
              </button>
            )}
            
            {currentStep < 8 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Create Report'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}


