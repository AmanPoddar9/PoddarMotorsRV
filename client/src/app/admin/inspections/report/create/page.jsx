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

  // Checklist State
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

  const [inspectorNotes, setInspectorNotes] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        bookingId,
        inspectorId: '656e6d706c6f796565313233', // Mock Inspector ID
        checklist,
        inspectorNotes
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

        {/* Car Details Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
            <div>
              <p className="text-gray-500 text-sm">Car</p>
              <p className="font-medium text-white">{booking.brand} {booking.model}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Registration</p>
              <p className="font-medium text-white">{booking.registrationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Year</p>
              <p className="font-medium text-white">{booking.year}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Fuel</p>
              <p className="font-medium text-white">{booking.fuelType}</p>
            </div>
          </div>
        </div>

        {/* Checklist Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Inspection Checklist</h2>
            
            <div className="space-y-6">
              {Object.keys(checklist).map((category) => (
                <div key={category} className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-lg font-medium text-white capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Score (1-10):</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={checklist[category].score}
                        onChange={(e) => handleScoreChange(category, e.target.value)}
                        className="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-center focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder={`Remarks for ${category}...`}
                    value={checklist[category].remarks}
                    onChange={(e) => handleRemarksChange(category, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Overall Notes</h2>
            <textarea
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Final verdict and summary..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Report...' : 'Submit Inspection Report'}
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
