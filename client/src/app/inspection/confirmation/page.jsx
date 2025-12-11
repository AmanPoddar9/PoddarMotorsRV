'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import API_URL from '@/app/config/api'

const API_BASE_URL = API_URL

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingRef = searchParams.get('ref')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingRef) {
      fetchBooking()
    }
  }, [bookingRef])

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/bookings/${bookingRef}`)
      const data = await res.json()
      setBooking(data)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Booking Not Found</h1>
          <Link href="/inspection/book" className="text-blue-400 underline">
            Book a new inspection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-300">Your inspection has been successfully scheduled</p>
        </div>

        {/* Booking Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Booking Details</h2>
            <div className="bg-blue-600 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-100">Reference Number</p>
              <p className="text-2xl font-bold text-white tracking-wider">{booking._id}</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-200">
            <div className="border-b border-white/20 pb-3">
              <p className="text-sm text-gray-400">Customer</p>
              <p className="text-lg font-semibold text-white">{booking.customerName}</p>
              <p>{booking.customerPhone}</p>
              {booking.customerEmail && <p>{booking.customerEmail}</p>}
            </div>

            <div className="border-b border-white/20 pb-3">
              <p className="text-sm text-gray-400">Vehicle</p>
              <p className="text-lg font-semibold text-white">
                {booking.brand} {booking.model} {booking.variant}
              </p>
              <p>Registration: {booking.registrationNumber}</p>
              <p>Year: {booking.year} | {booking.kmDriven} km | {booking.fuelType} | {booking.transmissionType}</p>
            </div>

            <div className="border-b border-white/20 pb-3">
              <p className="text-sm text-gray-400">Appointment</p>
              <p className="text-lg font-semibold text-white">
                {new Date(booking.appointmentDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p>{booking.appointmentTimeSlot}</p>
            </div>

            <div className="border-b border-white/20 pb-3">
              <p className="text-sm text-gray-400">Inspection Location</p>
              <p className="text-white">
                {booking.inspectionLocation.address}<br />
                {booking.inspectionLocation.city} - {booking.inspectionLocation.pincode}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                booking.status === 'Confirmed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">What Happens Next?</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-0.5">1</span>
              <span>You'll receive a confirmation call within 24 hours</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-0.5">2</span>
              <span>Our certified inspector will visit at the scheduled time</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-0.5">3</span>
              <span>Inspection takes approximately 45-60 minutes</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-0.5">4</span>
              <span>Detailed report sent within 2 hours of inspection</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-0.5">5</span>
              <span>Your car enters our dealer auction platform</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-blue-100 mb-4">Contact us if you have any questions about your booking</p>
          <a
            href="tel:+919876543210"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all"
          >
            Call Us: +91 98765 43210
          </a>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-lg border border-white/30 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
