'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:4000' 
    : 'https://www.poddarmotors.com'
)

/* ... skipping to component ... */

                {loadingSlots && <p className="text-gray-300">Loading available slots...</p>}

                {!loadingSlots && formData.appointmentDate && availableSlots.length === 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg text-yellow-200">
                    <p className="font-semibold">⚠️ No slots available for this date</p>
                    <p className="text-sm mt-1">Please select a different date for your inspection.</p>
                  </div>
                )}

                {availableSlots.length > 0 && (
                  <div>
                    <label className="block text-gray-200 mb-2">Select Time Slot *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, appointmentTimeSlot: slot.slot })}
                          disabled={!slot.available}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            formData.appointmentTimeSlot === slot.slot
                              ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                              : slot.available
                              ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {slot.slot}
                          <br />
                          <span className="text-xs">
                            {slot.available ? `${slot.spotsLeft} spots left` : 'Fully Booked'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

export default function BookInspectionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [formData, setFormData] = useState({
    // Customer Details
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Car Details
    registrationNumber: '',
    brand: '',
    model: '',
    variant: '',
    year: new Date().getFullYear() - 5,
    kmDriven: '',
    fuelType: 'Petrol',
    transmissionType: 'Manual',
    
    // Appointment
    appointmentDate: '',
    appointmentTimeSlot: '',
    address: '',
    city: '',
    pincode: '',
    
    // Payment
    inspectionFee: 0
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/slots/available?date=${date}`)
      const data = await res.json()
      setAvailableSlots(data)
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setFormData({ ...formData, appointmentDate: date, appointmentTimeSlot: '' })
    if (date) {
      fetchAvailableSlots(date)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.customerName || !formData.customerPhone) {
        alert('Please fill in all customer details')
        return false
      }
      if (formData.customerPhone.length !== 10) {
        alert('Phone number must be 10 digits')
        return false
      }
    } else if (step === 2) {
      if (!formData.registrationNumber || !formData.brand || !formData.model || !formData.kmDriven) {
        alert('Please fill in all car details')
        return false
      }
    } else if (step === 3) {
      if (!formData.appointmentDate || !formData.appointmentTimeSlot || !formData.address || !formData.city || !formData.pincode) {
        alert('Please select appointment date, time, and location')
        return false
      }
    }
    return true
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    
    setLoading(true)
    
    try {
      // Step 1: Create booking
      const bookingPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        registrationNumber: formData.registrationNumber.toUpperCase(),
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        year: parseInt(formData.year),
        kmDriven: parseInt(formData.kmDriven),
        fuelType: formData.fuelType,
        transmissionType: formData.transmissionType, appointmentDate: formData.appointmentDate,
        appointmentTimeSlot: formData.appointmentTimeSlot,
        inspectionLocation: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        inspectionFee: 0,
        paymentStatus: 'Free'
      }

      const bookingRes = await fetch(`${API_BASE_URL}/api/inspections/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      })

      const bookingData = await bookingRes.json()

      if (!bookingRes.ok) {
        alert(bookingData.error || 'Booking failed')
        setLoading(false)
        return
      }

      // Success - Redirect to confirmation
      router.push(`/inspection/confirmation?ref=${bookingData.bookingReference}`)

    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Renault', 'Ford', 'Volkswagen', 'Skoda', 'MG', 'Nissan', 'Other']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Book Car Inspection</h1>
          <p className="text-gray-300">Get your car professionally inspected and auctioned</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full ${currentStep >= step ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                <p className={`text-sm mt-2 text-center ${currentStep >= step ? 'text-blue-400' : 'text-gray-500'}`}>
                  {step === 1 && 'Your Details'}
                  {step === 2 && 'Car Details'}
                  {step === 3 && 'Appointment'}
                  {step === 4 && 'Payment'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Details</h2>
                
                <div>
                  <label className="block text-gray-200 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Continue to Car Details →
                 </button>
              </div>
            )}

            {/* Step 2: Car Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Car Details</h2>

                <div>
                  <label className="block text-gray-200 mb-2">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MH01AB1234"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-200 mb-2">Brand *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Brand</option>
                      {brands.map(b => (
                        <option key={b} value={b} className="bg-gray-800">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Swift"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-200 mb-2">Variant (Optional)</label>
                  <input
                    type="text"
                    name="variant"
                    value={formData.variant}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. VXI, ZXI"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-200 mb-2">Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">Kilometers Driven *</label>
                    <input
                      type="number"
                      name="kmDriven"
                      value={formData.kmDriven}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-200 mb-2">Fuel Type *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Petrol" className="bg-gray-800">Petrol</option>
                      <option value="Diesel" className="bg-gray-800">Diesel</option>
                      <option value="CNG" className="bg-gray-800">CNG</option>
                      <option value="Electric" className="bg-gray-800">Electric</option>
                      <option value="Hybrid" className="bg-gray-800">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">Transmission *</label>
                    <select
                      name="transmissionType"
                      value={formData.transmissionType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Manual" className="bg-gray-800">Manual</option>
                      <option value="Automatic" className="bg-gray-800">Automatic</option>
                      <option value="AMT" className="bg-gray-800">AMT</option>
                      <option value="CVT" className="bg-gray-800">CVT</option>
                      <option value="DCT" className="bg-gray-800">DCT</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Continue to Appointment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Appointment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Schedule Appointment</h2>

                <div>
                  <label className="block text-gray-200 mb-2">Select Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {loadingSlots && <p className="text-gray-300">Loading available slots...</p>}

                {availableSlots.length > 0 && (
                  <div>
                    <label className="block text-gray-200 mb-2">Select Time Slot *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, appointmentTimeSlot: slot.slot })}
                          disabled={!slot.available}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            formData.appointmentTimeSlot === slot.slot
                              ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                              : slot.available
                              ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {slot.slot}
                          <br />
                          <span className="text-xs">
                            {slot.available ? `${slot.spotsLeft} spots left` : 'Fully Booked'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-200 mb-2">Inspection Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your address for inspection"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-200 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Confirm & Pay</h2>

                <div className="bg-white/20 rounded-lg p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-white">Booking Summary</h3>
                  <div className="border-t border-white/30 pt-3 space-y-2 text-gray-200">
                    <p><strong>Name:</strong> {formData.customerName}</p>
                    <p><strong>Phone:</strong> {formData.customerPhone}</p>
                    <p><strong>Car:</strong> {formData.brand} {formData.model} ({formData.year})</p>
                    <p><strong>Registration:</strong> {formData.registrationNumber}</p>
                    <p><strong>Appointment:</strong> {formData.appointmentDate} at {formData.appointmentTimeSlot}</p>
                    <p><strong>Location:</strong> {formData.address}, {formData.city} - {formData.pincode}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xl font-semibold">Inspection Fee</span>
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">100+ point professional inspection</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">What Happens Next?</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">1</span>
              <span>Our certified inspector will visit your location at the scheduled time</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">2</span>
              <span>Complete 100+ point inspection covering mechanical, electrical, exterior, interior & documents</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">3</span>
              <span>Receive detailed inspection report within 2 hours</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">4</span>
              <span>Your car gets listed in our exclusive dealer auction platform</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">5</span>
              <span>Get the best price from competing dealers!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
