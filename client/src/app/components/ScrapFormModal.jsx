'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const ScrapFormModal = ({ showForm, setShowForm, setShowModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    location: '',
    registrationNumber: '',
    brand: '',
    model: '',
    manufactureYear: '',
    kilometers: '',
    condition: '',
    carType: '',
    preferredPickupDate: '',
  })

  useEffect(() => {
    if (showForm) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [showForm])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const compulsoryFields = [
      'name',
      'phoneNumber',
      'location',
      'registrationNumber',
      'brand',
      'model',
      'manufactureYear',
      'condition',
    ]
    const missingFields = compulsoryFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      const url = 'https://poddar-motors-rv-hkxu.vercel.app/'
      const response = await fetch(url + 'api/scrapRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
        }, 3000)
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          location: '',
          registrationNumber: '',
          brand: '',
          model: '',
          manufactureYear: '',
          kilometers: '',
          condition: '',
          carType: '',
          preferredPickupDate: '',
        })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting scrap request:', error)
      alert('Error submitting request. Please try again or call us directly.')
    }
  }

  if (!showForm) return null

  return (
    <div className="modal">
      <form
        className="grid grid-cols-1 gap-4 p-4 bg-custom-gray rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-2xl text-custom-seasalt">
            Get Free Scrap Quote
          </h3>
          <button type="button" onClick={() => setShowForm(false)}>
            <XMarkIcon
              className="h-6 w-6 text-custom-seasalt"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Personal Information */}
        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-custom-jet rounded text-black w-full"
              required
            />
          </div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Phone Number *
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              pattern="^(?:\+?91\s?)?0?[0-9]{10}$"
              title="Enter valid 10-digit phone number"
              required
            />
          </div>
        </div>

        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
            />
          </div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              required
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Registration Number *
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              required
              maxLength={10}
            />
          </div>

          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              required
            />
          </div>
        </div>

        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              required
            />
          </div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Manufacture Year *
            </label>
            <input
              type="number"
              name="manufactureYear"
              value={formData.manufactureYear}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              required
            />
          </div>
        </div>

        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Car Type
            </label>
            <select
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black bg-white"
            >
              <option value="">Select Type</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="muv">MUV</option>
            </select>
          </div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black bg-white"
              required
            >
              <option value="">Select Condition</option>
              <option value="good">Good (Running)</option>
              <option value="fair">Fair (Minor Issues)</option>
              <option value="poor">Poor (Non-Running)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Kilometers Driven
            </label>
            <input
              type="number"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
            />
          </div>
          <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
            <label className="font-normal text-sm text-custom-seasalt">
              Preferred Pickup Date
            </label>
            <input
              type="date"
              name="preferredPickupDate"
              value={formData.preferredPickupDate}
              onChange={handleChange}
              className="w-full p-2 border border-custom-jet rounded text-black"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-custom-yellow text-custom-black font-bold hover:bg-custom-black hover:text-custom-yellow border-2 border-custom-yellow px-6 py-3 rounded transition duration-300"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}

export default ScrapFormModal
