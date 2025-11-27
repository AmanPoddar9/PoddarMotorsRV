'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPlus, FaTrash, FaCar, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa'
import API_URL from '../../config/api'

export default function ProfileRequirements() {
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    budgetMin: '',
    budgetMax: '',
    yearMin: ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  // Common car brands in India
  const brands = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 
    'Toyota', 'Kia', 'Volkswagen', 'Renault', 'Skoda', 
    'MG', 'Nissan', 'Jeep', 'Audi', 'BMW', 'Mercedes-Benz'
  ]

  useEffect(() => {
    fetchRequirements()
  }, [])

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/customer/requirements`, { withCredentials: true })
      setRequirements(res.data)
    } catch (error) {
      console.error('Error fetching requirements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitLoading(true)
      await axios.post(`${API_URL}/api/customer/requirements`, formData, { withCredentials: true })
      setFormData({
        brand: '',
        model: '',
        budgetMin: '',
        budgetMax: '',
        yearMin: ''
      })
      setShowForm(false)
      fetchRequirements()
    } catch (error) {
      console.error('Error creating requirement:', error)
      alert('Failed to add requirement')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return
    try {
      await axios.delete(`${API_URL}/api/customer/requirements/${id}`, { withCredentials: true })
      fetchRequirements()
    } catch (error) {
      console.error('Error deleting requirement:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Car Requirements</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-custom-accent text-custom-black font-bold rounded-lg hover:bg-yellow-400 transition"
        >
          <FaPlus /> Add Requirement
        </button>
      </div>

      {/* Add Requirement Form */}
      {showForm && (
        <div className="bg-custom-jet p-6 rounded-xl border border-white/10 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Requirement</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-custom-platinum text-sm mb-1">Brand *</label>
              <select
                required
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full bg-custom-black border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-custom-platinum text-sm mb-1">Model (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Swift"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full bg-custom-black border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-custom-platinum text-sm mb-1">Min Budget (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.budgetMin}
                onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                className="w-full bg-custom-black border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-custom-platinum text-sm mb-1">Max Budget (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 500000"
                value={formData.budgetMax}
                onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                className="w-full bg-custom-black border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-custom-platinum text-sm mb-1">Min Year</label>
              <input
                type="number"
                placeholder="e.g. 2015"
                value={formData.yearMin}
                onChange={(e) => setFormData({...formData, yearMin: e.target.value})}
                className="w-full bg-custom-black border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-custom-platinum hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-2 bg-custom-accent text-custom-black font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {submitLoading ? 'Saving...' : 'Save Requirement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requirements List */}
      {loading ? (
        <div className="text-center py-8 text-custom-platinum">Loading requirements...</div>
      ) : requirements.length === 0 ? (
        <div className="text-center py-12 bg-custom-jet/50 rounded-xl border border-white/5">
          <FaCar className="text-4xl text-custom-platinum/20 mx-auto mb-4" />
          <p className="text-custom-platinum">No requirements added yet.</p>
          <p className="text-sm text-custom-platinum/60 mt-1">Add a requirement to get notified when matching cars arrive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req) => (
            <div key={req._id} className="bg-custom-jet p-5 rounded-xl border border-white/10 hover:border-custom-accent/50 transition group relative">
              <button
                onClick={() => handleDelete(req._id)}
                className="absolute top-4 right-4 text-custom-platinum/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                title="Delete Requirement"
              >
                <FaTrash />
              </button>
              
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{req.brand} {req.model}</h3>
                  <p className="text-custom-accent text-sm font-medium">Active Alert</p>
                </div>
              </div>
              
              <div className="space-y-2 text-custom-platinum text-sm">
                <div className="flex items-center gap-2">
                  <FaRupeeSign className="text-custom-accent" />
                  <span>Budget: ₹{req.budgetMin.toLocaleString()} - ₹{req.budgetMax.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-custom-accent" />
                  <span>Year: {req.yearMin}+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
