'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import ImageUpload from '../../../components/admin/ImageUpload'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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

export default function CreateInspectionReport() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  
  const [currentStep, setCurrentStep] = useState(1)
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
    interiorControls: {},
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
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/inspections/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        alert('Inspection report created successfully!')
        router.push(`/admin/inspections/report/${data._id}`)
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
                <CheckItem label="HPA NOC Received" name="hpaNocReceived" value={formData.documentation.hpaNoc Received} onChange={(val) => updateCheckItem('documentation', 'hpaNocReceived', val)} />
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
          
          {/* Placeholder for other steps - will implement fully in subsequent updates */}
          {currentStep > 2 && currentStep < 8 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Step {currentStep}: {
                  currentStep === 3 ? 'Features & Warning Lamps' :
                  currentStep === 4 ? 'Mechanical Inspection' :
                  currentStep === 5 ? 'Body & Structure' :
                  currentStep === 6 ? 'Electrical & Interior' :
                  'Underbody & Road Test'
                }
              </h2>
              <p className="text-gray-400">This section will be fully implemented in the next update.</p>
              <p className="text-sm text-gray-500 mt-2">For now, you can skip to Photos & Assessment (Step 8)</p>
            </div>
          )}
          
          {/* Step 8: Photos & Final Assessment */}
          {currentStep === 8 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Step 8: Photos & Final Assessment</h2>
              
              {/* Photo Uploads */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Required Photos (25 total)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Front 3/4 View</label>
                    <ImageUpload 
                      maxImages={1}
                      onImagesChange={(urls) => updateField('photos', 'front34', urls[0] || '')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Rear 3/4 View</label>
                    <ImageUpload 
                      maxImages={1}
                      onImagesChange={(urls) => updateField('photos', 'rear34', urls[0] || '')}
                    />
                  </div>
                  {/* Add more photo upload fields... */}
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
