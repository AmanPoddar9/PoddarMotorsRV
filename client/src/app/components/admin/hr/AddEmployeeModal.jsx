'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import API_URL from '../../../config/api'

const AddEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    gender: 'Male',
    status: 'Active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    console.log('API URL:', API_URL)
    try {
      await axios.post(`${API_URL}/api/employees`, formData)
      onSuccess()
    } catch (err) {
      console.error('Full Error:', err)
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-custom-jet border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Add New Employee</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-400">First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" placeholder="John" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" placeholder="Doe" />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Phone *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" placeholder="+91 98765 43210" />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-400">Department *</label>
                <select required name="department" value={formData.department} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none appearance-none">
                    <option value="">Select Department</option>
                    <option value="Sales">Sales</option>
                    <option value="Service">Service / Workshop</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Management">Management</option>
                    <option value="Logistics">Logistics</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Designation *</label>
                <input required name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" placeholder="e.g. Sales Executive" />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-400">Joining Date *</label>
                <input required type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" />
            </div>
             <div className="space-y-2">
                <label className="text-sm text-gray-400">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-custom-accent text-black px-6 py-2 rounded-lg font-bold hover:bg-custom-accent/80 transition-colors disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddEmployeeModal
