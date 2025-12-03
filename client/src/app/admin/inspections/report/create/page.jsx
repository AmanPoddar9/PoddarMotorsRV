'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

function CreateReportContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [inspectorName, setInspectorName] = useState('')
  const [inspectorPhone, setInspectorPhone] = useState('')
  const [recommendation, setRecommendation] = useState('Ready for Auction')
  const [notes, setNotes] = useState('')

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
        // Pre-fill inspector details if assigned
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

  const generateDefaultChecklist = () => {
    // Helper to create a default "Pass" item
    const passItem = { status: 'Pass', notes: '' }
    
    return {
      mechanical: {
        engineStart: passItem, engineSound: passItem, engineOilLevel: passItem, engineOilCondition: passItem,
        coolantLevel: passItem, engineMounts: passItem, exhaustSmoke: passItem, engineVibration: passItem,
        timingBelt: passItem, sparkPlugs: passItem, airFilter: passItem, fuelFilter: passItem,
        transmissionOilLevel: passItem, transmissionOilCondition: passItem, clutchOperation: passItem,
        gearShifting: passItem, gearboxNoise: passItem, driveShaft: passItem, differentialOil: passItem,
        transmissionLeaks: passItem, frontBrakePads: passItem, rearBrakePads: passItem, brakeFluidLevel: passItem,
        brakeFluidCondition: passItem, brakePedal: passItem, handbrake: passItem, brakeDiscs: passItem,
        brakeLines: passItem, absSystem: passItem, brakePerformance: passItem, frontSuspension: passItem,
        rearSuspension: passItem, shockAbsorbers: passItem, springs: passItem, ballJoints: passItem,
        controlArms: passItem, steeringRack: passItem, powerSteering: passItem, wheelBearings: passItem,
        wheelAlignment: passItem
      },
      electrical: {
        batteryVoltage: passItem, batteryCondition: passItem, alternator: passItem, starterMotor: passItem,
        headlights: passItem, tailLights: passItem, indicators: passItem, fogLights: passItem,
        dashboardLights: passItem, warningLights: passItem, wipers: passItem, horn: passItem,
        powerWindows: passItem, centralLocking: passItem, infotainmentSystem: passItem, speakers: passItem,
        airConditioner: passItem, heater: passItem, sensors: passItem, ecuDiagnostics: passItem
      },
      exterior: {
        frontBumper: passItem, rearBumper: passItem, hood: passItem, roof: passItem, doors: passItem,
        fenders: passItem, paintCondition: passItem, rustCorrosion: passItem, windshield: passItem,
        rearGlass: passItem, sideGlass: passItem, headlightLenses: passItem, taillightLenses: passItem,
        mirrors: passItem, doorHandles: passItem, frontLeftTyre: passItem, frontRightTyre: passItem,
        rearLeftTyre: passItem, rearRightTyre: passItem, spareTyre: passItem
      },
      interior: {
        driverSeat: passItem, passengerSeat: passItem, rearSeats: passItem, seatBelts: passItem,
        dashboard: passItem, steeringWheel: passItem, gearKnob: passItem, carpets: passItem,
        headliner: passItem, doorPanels: passItem, climateControls: passItem, interiorLights: passItem,
        sunroof: passItem, bootSpace: passItem, odorStains: passItem
      },
      documentation: {
        registrationCertificate: passItem, insurance: passItem, servicingHistory: passItem,
        previousAccidents: passItem, ownershipHistory: passItem
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Generate full payload matching the schema
      const checklist = generateDefaultChecklist()
      
      const payload = {
        bookingId,
        inspectorName,
        inspectorPhone,
        inspectionDate: new Date(),
        ...checklist,
        summary: {
          strengths: ['Engine in good condition', 'Clean interior'],
          weaknesses: ['Minor scratches on bumper'],
          majorIssues: [],
          recommendation: recommendation
        },
        overallScore: 90, // Dummy score for testing
        overallGrade: 'Excellent'
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Submit Inspection Report</h1>

        {/* Car Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-300">
            <p><span className="text-gray-500">Car:</span> {booking.brand} {booking.model}</p>
            <p><span className="text-gray-500">Reg:</span> {booking.registrationNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Inspector Details</h2>
            
            <div>
              <label className="block text-gray-300 mb-2">Inspector Name</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Inspector Phone</label>
              <input
                type="text"
                value={inspectorPhone}
                onChange={(e) => setInspectorPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Recommendation</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              >
                <option value="Ready for Auction">Ready for Auction</option>
                <option value="Needs Minor Repairs">Needs Minor Repairs</option>
                <option value="Needs Major Repairs">Needs Major Repairs</option>
                <option value="Not Recommended">Not Recommended</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg text-blue-200 text-sm">
            <strong>Note:</strong> For testing purposes, this form will auto-fill all 100+ inspection points with "Pass". You can edit the specific details in the database later if needed.
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Full Report'}
            </button>
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
