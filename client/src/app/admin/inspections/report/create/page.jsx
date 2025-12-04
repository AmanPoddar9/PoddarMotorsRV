'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import ImageUpload from '@/app/components/admin/ImageUpload'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

function CreateReportContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Inspector Details
  const [inspectorName, setInspectorName] = useState('')
  const [inspectorPhone, setInspectorPhone] = useState('')
  const [recommendation, setRecommendation] = useState('Ready for Auction')
  const [notes, setNotes] = useState('')

  // Photos State
  const [photos, setPhotos] = useState({
    exterior: [],
    interior: [],
    engine: [],
    tyres: [],
    damages: []
  })

  // Simplified Checklist State (Category Level)
  const [checklist, setChecklist] = useState({
    engine: { score: 10, remarks: '' },
    transmission: { score: 10, remarks: '' },
    brakes: { score: 10, remarks: '' },
    suspension: { score: 10, remarks: '' },
    exterior: { score: 10, remarks: '' },
    interior: { score: 10, remarks: '' },
    electrical: { score: 10, remarks: '' },
    tyres: { score: 10, remarks: '' },
    documents: { score: 10, remarks: '' },
    ac: { score: 10, remarks: '' }
  })

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/bookings/${bookingId}`)
      const data = await res.json()
      if (res.ok) {
        setBooking(data)
        if (data.assignedInspector) {
          setInspectorName(data.assignedInspector.name || '')
          setInspectorPhone(data.assignedInspector.phone || '')
        }
      } else {
        alert('Booking not found')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (category, value) => {
    setChecklist(prev => ({
      ...prev,
      [category]: { ...prev[category], score: parseInt(value) }
    }))
  }

  const handleRemarksChange = (category, value) => {
    setChecklist(prev => ({
      ...prev,
      [category]: { ...prev[category], remarks: value }
    }))
  }

  // Helper to generate detailed schema from simplified inputs
  const generateDetailedPayload = () => {
    const getStatus = (score) => {
      if (score >= 8) return 'Pass'
      if (score >= 5) return 'Warning'
      return 'Fail'
    }

    const createCategoryItems = (categoryKey, itemKeys) => {
      const input = checklist[categoryKey] || { score: 10, remarks: '' }
      const status = getStatus(input.score)
      const items = {}
      
      itemKeys.forEach(key => {
        items[key] = {
          status: status,
          notes: input.remarks // Apply category remarks to all items for simplicity
        }
      })
      return items
    }

    // Map simplified inputs to detailed schema keys
    const mechanicalItems = createCategoryItems('engine', [
      'engineStart', 'engineSound', 'engineOilLevel', 'engineOilCondition', 'coolantLevel', 
      'engineMounts', 'exhaustSmoke', 'engineVibration', 'timingBelt', 'sparkPlugs', 
      'airFilter', 'fuelFilter'
    ])
    
    // Merge other mechanical parts (transmission, brakes, suspension) into 'mechanical'
    const transmissionItems = createCategoryItems('transmission', [
      'transmissionOilLevel', 'transmissionOilCondition', 'clutchOperation', 'gearShifting', 
      'gearboxNoise', 'driveShaft', 'differentialOil', 'transmissionLeaks'
    ])
    
    const brakeItems = createCategoryItems('brakes', [
      'frontBrakePads', 'rearBrakePads', 'brakeFluidLevel', 'brakeFluidCondition', 'brakePedal', 
      'handbrake', 'brakeDiscs', 'brakeLines', 'absSystem', 'brakePerformance'
    ])

    const suspensionItems = createCategoryItems('suspension', [
      'frontSuspension', 'rearSuspension', 'shockAbsorbers', 'springs', 'ballJoints', 
      'controlArms', 'steeringRack', 'powerSteering', 'wheelBearings', 'wheelAlignment'
    ])

    const electricalItems = createCategoryItems('electrical', [
      'batteryVoltage', 'batteryCondition', 'alternator', 'starterMotor', 'headlights', 
      'tailLights', 'indicators', 'fogLights', 'dashboardLights', 'warningLights', 'wipers', 
      'horn', 'powerWindows', 'centralLocking', 'infotainmentSystem', 'speakers', 
      'airConditioner', 'heater', 'sensors', 'ecuDiagnostics'
    ])

    const exteriorItems = createCategoryItems('exterior', [
      'frontBumper', 'rearBumper', 'hood', 'roof', 'doors', 'fenders', 'paintCondition', 
      'rustCorrosion', 'windshield', 'rearGlass', 'sideGlass', 'headlightLenses', 
      'taillightLenses', 'mirrors', 'doorHandles', 'frontLeftTyre', 'frontRightTyre', 
      'rearLeftTyre', 'rearRightTyre', 'spareTyre'
    ])

    const interiorItems = createCategoryItems('interior', [
      'driverSeat', 'passengerSeat', 'rearSeats', 'seatBelts', 'dashboard', 'steeringWheel', 
      'gearKnob', 'carpets', 'headliner', 'doorPanels', 'climateControls', 'interiorLights', 
      'sunroof', 'bootSpace', 'odorStains'
    ])

    const documentationItems = createCategoryItems('documents', [
      'registrationCertificate', 'insurance', 'servicingHistory', 'previousAccidents', 
      'ownershipHistory'
    ])

    return {
      mechanical: { ...mechanicalItems, ...transmissionItems, ...brakeItems, ...suspensionItems },
      electrical: electricalItems,
      exterior: exteriorItems,
      interior: interiorItems,
      documentation: documentationItems
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const detailedChecklist = generateDetailedPayload()
      
      // Calculate average score for display
      const totalScore = Object.values(checklist).reduce((sum, item) => sum + item.score, 0)
      const avgScore = Math.round((totalScore / Object.keys(checklist).length) * 10)

      const payload = {
        bookingId,
        inspectorName,
        inspectorPhone,
        inspectionDate: new Date(),
        ...detailedChecklist,
        summary: {
          strengths: notes ? [notes] : ['Car is in good condition'],
          weaknesses: [],
          majorIssues: [],
          recommendation: recommendation
        },
        photos: {
          front: photos.exterior[0] || '',
          rear: photos.exterior[1] || '',
          left: photos.exterior[2] || '',
          right: photos.exterior[3] || '',
          interior: photos.interior,
          engine: photos.engine,
          damages: photos.damages
        },
        overallScore: avgScore,
        overallGrade: avgScore >= 85 ? 'Excellent' : avgScore >= 70 ? 'Good' : avgScore >= 50 ? 'Fair' : 'Poor'
      }

      const res = await fetch(`${API_BASE_URL}/api/inspections/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Inspection Report Created Successfully!')
        router.push('/admin/inspections')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create report')
        console.error('Validation Error:', data)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting report')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-white text-center p-10">Loading booking details...</div>
  if (!booking) return <div className="text-white text-center p-10">Booking not found</div>

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Create Inspection Report</h1>

        {/* Car Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
            <div><p className="text-gray-500 text-sm">Car</p><p className="font-medium text-white">{booking.brand} {booking.model}</p></div>
            <div><p className="text-gray-500 text-sm">Reg</p><p className="font-medium text-white">{booking.registrationNumber}</p></div>
            <div><p className="text-gray-500 text-sm">Year</p><p className="font-medium text-white">{booking.year}</p></div>
            <div><p className="text-gray-500 text-sm">Fuel</p><p className="font-medium text-white">{booking.fuelType}</p></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inspector Info */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Inspector Name</label>
              <input type="text" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white" required />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Inspector Phone</label>
              <input type="text" value={inspectorPhone} onChange={(e) => setInspectorPhone(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white" required />
            </div>
          </div>

          {/* Checklist Form */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Inspection Checklist</h2>
            <div className="space-y-6">
              {Object.keys(checklist).map((category) => (
                <div key={category} className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-lg font-medium text-white capitalize">{category}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Score (1-10):</span>
                      <input type="number" min="1" max="10" value={checklist[category].score} onChange={(e) => handleScoreChange(category, e.target.value)} className="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-center focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <textarea placeholder={`Remarks for ${category}...`} value={checklist[category].remarks} onChange={(e) => handleRemarksChange(category, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" />
              ))}
            </div>
          </div>

          {/* Photos Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Car Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload 
                label="Exterior (Front, Rear, Sides)" 
                maxFiles={8}
                onUpload={(urls) => setPhotos(prev => ({ ...prev, exterior: urls }))} 
              />
              <ImageUpload 
                label="Interior (Dashboard, Seats)" 
                maxFiles={8}
                onUpload={(urls) => setPhotos(prev => ({ ...prev, interior: urls }))} 
              />
              <ImageUpload 
                label="Engine Bay" 
                maxFiles={4}
                onUpload={(urls) => setPhotos(prev => ({ ...prev, engine: urls }))} 
              />
              <ImageUpload 
                label="Tyres & Wheels" 
                maxFiles={5}
                onUpload={(urls) => setPhotos(prev => ({ ...prev, tyres: urls }))} 
              />
              <ImageUpload 
                label="Defects / Scratches" 
                maxFiles={10}
                onUpload={(urls) => setPhotos(prev => ({ ...prev, damages: urls }))} 
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Final Verdict</h2>
            <div>
              <label className="block text-gray-300 mb-2">Recommendation</label>
              <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                <option value="Ready for Auction">Ready for Auction</option>
                <option value="Needs Minor Repairs">Needs Minor Repairs</option>
                <option value="Needs Major Repairs">Needs Major Repairs</option>
                <option value="Not Recommended">Not Recommended</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Overall Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 h-32" placeholder="Summary of the car condition..." />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CreateReportPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <CreateReportContent />
    </Suspense>
  )
}
