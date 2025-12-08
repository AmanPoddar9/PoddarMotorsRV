'use client'

import { useState } from 'react'
import API_URL from '../../config/api'

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carModel: '',
    serviceType: '',
    date: '',
    message: ''
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success') // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const showNotification = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000) // Show for 4 seconds
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create the payload with correct field names
      const payload = {
        name: formData.name,
        mobileNumber: formData.phone,
        carModel: formData.carModel,
        serviceType: formData.serviceType,
        date: formData.date,
        message: formData.message
      }

      const url = API_URL

      const response = await fetch(url + '/api/workshop-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        showNotification('Thank you! Your service request has been received. We will contact you shortly.', 'success')
        setFormData({
          name: '',
          phone: '',
          carModel: '',
          serviceType: '',
          date: '',
          message: ''
        })
      } else {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        showNotification('Something went wrong. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showNotification('Error submitting form. Please check your connection and try again.', 'error')
    }
  }

  return (
    <section id="book-service" className="py-20 bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className={`${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md`}>
            {toastType === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className="font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Info */}
          <div className="md:w-1/3 bg-workshop-blue p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Book a Service</h3>
              <p className="text-blue-100 mb-8">
                Fill out the form to schedule your service appointment. Our team will confirm your slot.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-workshop-red rounded-full"></div>
                  <span className="font-medium">Priority Service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-workshop-red rounded-full"></div>
                  <span className="font-medium">Genuine Parts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-workshop-red rounded-full"></div>
                  <span className="font-medium">Expert Care</span>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-sm text-blue-200">Need immediate assistance?</p>
              <p className="text-xl font-bold mt-1">+91 8709119090</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-2/3 p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Model</label>
                  <select
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                  >
                    <option value="">Select Model</option>
                    <option value="Alto">Alto</option>
                    <option value="Swift">Swift</option>
                    <option value="Dzire">Dzire</option>
                    <option value="WagonR">WagonR</option>
                    <option value="Brezza">Brezza</option>
                    <option value="Ertiga">Ertiga</option>
                    <option value="Baleno">Baleno</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                  >
                    <option value="">Select Service</option>
                    <option value="Periodic Maintenance">Periodic Maintenance</option>
                    <option value="Denting & Painting">Denting & Painting</option>
                    <option value="General Repair">General Repair</option>
                    <option value="AC Service">AC Service</option>
                    <option value="Car Spa">Car Spa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-workshop-blue focus:ring-2 focus:ring-workshop-blue/20 outline-none transition-all"
                  placeholder="Any specific issues or requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-workshop-red text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/20"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingForm
