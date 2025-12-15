'use client'
import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import API_URL from '../config/api'
import { trackLeadSubmission } from '../utils/analytics'

const SellRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    location: '',
    registrationNumber: '',
    brand: '',
    model: '',
    variant: '',
    manufactureYear: '',
    kilometers: '',
    price: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Check for compulsory fields
    const compulsoryFields = [
      'name',
      'phoneNumber',
      'location',
      'registrationNumber',
      'brand',
      'model',
      'manufactureYear',
      'kilometers',
    ]
    const missingFields = compulsoryFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`)
      setIsSubmitting(false)
      return
    }

    try {
      await axios.post(`${API_URL}/api/sellRequests`, formData)
      
      // Analytics: Track Lead Submission
      trackLeadSubmission({
        type: 'Sell Request',
        brand: formData.brand,
        model: formData.model,
        year: formData.manufactureYear,
      })

      setSubmitSuccess(true)
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        location: '',
        registrationNumber: '',
        brand: '',
        model: '',
        variant: '',
        manufactureYear: '',
        kilometers: '',
        price: '',
      })
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting sell request:', error)
      alert('Error submitting sell request. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center"
      >
        <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
        <p className="text-gray-200">
          Thank you for choosing us. Our purchase expert will contact you shortly with the best offer.
        </p>
        <button 
          onClick={() => setSubmitSuccess(false)}
          className="mt-6 text-sm text-green-400 hover:text-green-300 underline"
        >
          Submit another request
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number *"
          value={formData.phoneNumber}
          onChange={handleChange}
          pattern="^(?:\+?91\s?)?0?[0-9]{10}$"
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="brand"
          placeholder="Car Brand (e.g. Maruti) *"
          value={formData.brand}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Car Model (e.g. Swift) *"
          value={formData.model}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="manufactureYear"
          placeholder="Year (e.g. 2018) *"
          value={formData.manufactureYear}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Reg. Number (e.g. JH01...) *"
          value={formData.registrationNumber}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <input
          type="text"
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
         <input
          type="number"
          name="kilometers"
          placeholder="Kilometers Driven *"
          value={formData.kilometers}
          onChange={handleChange}
          className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-custom-yellow text-custom-black font-bold text-lg py-4 rounded-lg hover:bg-yellow-400 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Get Valuation Now'}
      </button>
    </form>
  )
}

export default SellRequestForm
