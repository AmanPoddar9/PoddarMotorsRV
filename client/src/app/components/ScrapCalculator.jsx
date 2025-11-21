'use client'

import { useState } from 'react'

const ScrapCalculator = ({ onGetAccurateQuote }) => {
  const [formData, setFormData] = useState({
    carType: '',
    year: '',
    condition: '',
  })
  const [estimate, setEstimate] = useState(null)

  const carTypes = [
    { value: 'hatchback', label: 'Hatchback', weight: 900 },
    { value: 'sedan', label: 'Sedan', weight: 1200 },
    { value: 'suv', label: 'SUV', weight: 1800 },
    { value: 'muv', label: 'MUV', weight: 1500 },
  ]

  const conditions = [
    { value: 'good', label: 'Good (Running)', multiplier: 1.2 },
    { value: 'fair', label: 'Fair (Minor issues)', multiplier: 1.0 },
    { value: 'poor', label: 'Poor (Non-running)', multiplier: 0.8 },
  ]

  const calculateEstimate = () => {
    if (!formData.carType || !formData.year || !formData.condition) {
      alert('Please fill all fields')
      return
    }

    const currentYear = new Date().getFullYear()
    const carAge = currentYear - parseInt(formData.year)

    // Base scrap rate per kg (₹40-50 for steel)
    const baseRate = 45

    // Find selected car type
    const selectedCarType = carTypes.find((ct) => ct.value === formData.carType)
    const weight = selectedCarType ? selectedCarType.weight : 1000

    // Find condition multiplier
    const selectedCondition = conditions.find(
      (c) => c.value === formData.condition,
    )
    const multiplier = selectedCondition ? selectedCondition.multiplier : 1.0

    // Calculate base value
    let estimatedValue = weight * baseRate * multiplier

    // Depreciation for older cars
    if (carAge > 15) {
      estimatedValue *= 0.9
    }

    // Add some variance
    const min = Math.floor(estimatedValue * 0.85)
    const max = Math.floor(estimatedValue * 1.15)

    setEstimate({ min, max })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setEstimate(null) // Reset estimate when form changes
  }

  return (
    <section className="bg-custom-black py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-custom-seasalt">
          Scrap Value Calculator
        </h2>
        <p className="text-center text-custom-platinum mb-12">
          Get an instant estimate of your car's scrap value
        </p>

        <div className="bg-custom-gray p-8 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-custom-seasalt font-semibold mb-2">
                Car Type
              </label>
              <select
                name="carType"
                value={formData.carType}
                onChange={handleChange}
                className="w-full p-3 border border-custom-jet rounded text-black bg-white"
              >
                <option value="">Select Type</option>
                {carTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-custom-seasalt font-semibold mb-2">
                Manufacturing Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g., 2010"
                min="1980"
                max={new Date().getFullYear()}
                className="w-full p-3 border border-custom-jet rounded text-black"
              />
            </div>

            <div>
              <label className="block text-custom-seasalt font-semibold mb-2">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-3 border border-custom-jet rounded text-black bg-white"
              >
                <option value="">Select Condition</option>
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calculateEstimate}
            className="w-full bg-custom-yellow text-custom-black font-bold py-3 px-6 rounded hover:bg-custom-black hover:text-custom-yellow border-2 border-custom-yellow transition duration-300"
          >
            Calculate Estimate
          </button>

          {estimate && (
            <div className="mt-8 p-6 bg-custom-yellow rounded-lg text-center">
              <h3 className="font-bold text-2xl mb-2 text-custom-black">
                Estimated Scrap Value
              </h3>
              <p className="text-4xl font-extrabold text-custom-black mb-4">
                ₹{estimate.min.toLocaleString('en-IN')} - ₹
                {estimate.max.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-custom-jet mb-4">
                *This is an approximate estimate. Actual value may vary based on
                inspection.
              </p>
              <button
                onClick={onGetAccurateQuote}
                className="bg-custom-black text-custom-yellow font-bold py-3 px-8 rounded hover:bg-custom-jet transition duration-300"
              >
                Get Accurate Quote
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ScrapCalculator
