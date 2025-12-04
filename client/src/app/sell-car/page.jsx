'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function SellYourCarPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    kilometers: '',
    condition: 'Good'
  })
  const [valuation, setValuation] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/valuation/instant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setValuation(data.valuation)
      } else {
        alert('Error calculating valuation: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to calculate valuation')
    } finally {
      setLoading(false)
    }
  }

  const handleBookInspection = () => {
    // Pre-fill the inspection booking form with car details
    const params = new URLSearchParams({
      brand: formData.brand,
      model: formData.model,
      year: formData.year
    })
    router.push(`/inspection/book?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Poddar Motors" className="h-8 w-auto" />
            <span className="font-bold text-xl">Poddar Motors RV</span>
          </div>
          <a href="tel:+919999999999" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold">
            Call Us
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!valuation ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Section */}
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Get Your Car's <span className="text-yellow-400">True Market Value</span> in 60 Seconds
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                We buy cars directly from owners and sell them to verified dealers through live auctions. Get the best price guaranteed.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">100+</div>
                  <div className="text-sm text-gray-400">Cars Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">50+</div>
                  <div className="text-sm text-gray-400">Dealers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">24h</div>
                  <div className="text-sm text-gray-400">Avg Sale Time</div>
                </div>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How It Works
                </h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  <li>Get instant valuation (30 seconds)</li>
                  <li>Book free 145-point inspection (₹499)</li>
                  <li>We list your car in live auction</li>
                  <li>Get paid in 24 hours</li>
                </ol>
              </div>
            </div>

            {/* Valuation Form */}
            <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Get Instant Valuation</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Car Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Tata">Tata</option>
                    <option value="Honda">Honda</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Ford">Ford</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Renault">Renault</option>
                    <option value="Nissan">Nissan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., Swift, i20, Nexon"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="2019"
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">KM Driven</label>
                    <input
                      type="number"
                      name="kilometers"
                      value={formData.kilometers}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Excellent">Excellent (Like New)</option>
                    <option value="Good">Good (Minor Wear)</option>
                    <option value="Fair">Fair (Visible Damage)</option>
                    <option value="Poor">Poor (Needs Repair)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Calculating...' : 'Get Instant Valuation'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  100% Free • No Obligation • Takes 30 Seconds
                </p>
              </form>
            </div>
          </div>
        ) : (
          /* Valuation Result */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Valuation Complete!
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {formData.brand} {formData.model} ({formData.year})
                </h2>
                <p className="text-gray-500">{valuation.message}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8 text-center">
                <p className="text-sm text-gray-600 mb-2">Estimated Market Value</p>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  ₹{valuation.estimatedValue.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Range: ₹{valuation.priceRange.min.toLocaleString()} - ₹{valuation.priceRange.max.toLocaleString()}
                </p>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    valuation.confidence === 'high' ? 'bg-green-200 text-green-800' :
                    valuation.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {valuation.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBookInspection}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-all"
                >
                  Book Free Inspection Now
                </button>
                <button
                  onClick={() => {
                    setValuation(null)
                    setFormData({ brand: '', model: '', year: '', kilometers: '', condition: 'Good' })
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all"
                >
                  Check Another Car
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold mb-4">Why Choose Poddar Motors RV?</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Best price through live auction</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>145-point inspection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Payment in 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full transparency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Poddar Motors RV. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
