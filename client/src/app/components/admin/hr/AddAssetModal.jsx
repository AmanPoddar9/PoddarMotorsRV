'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX, FiPackage } from 'react-icons/fi'
import { motion } from 'framer-motion'
import API_URL from '../../../config/api'

const AddAssetModal = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    identifier: ''
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

    try {
      await axios.post(`${API_URL}/api/employees/${employeeId}/assets`, formData)
      onSuccess()
    } catch (err) {
      console.error('Error adding asset:', err)
      setError(err.response?.data?.message || 'Failed to assign asset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-custom-jet border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Assign Asset</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Asset Name *</label>
            <input 
              required 
              name="itemName" 
              value={formData.itemName} 
              onChange={handleChange} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" 
              placeholder="e.g., MacBook Pro, SIM Card, Uniform"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Serial Number / Identifier</label>
            <input 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" 
              placeholder="e.g., SERIAL123456, +91 98765 43210"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-custom-accent text-black px-6 py-2 rounded-lg font-bold hover:bg-custom-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? (
                <>Assigning...</>
              ) : (
                <>
                  <FiPackage /> Assign Asset
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddAssetModal
