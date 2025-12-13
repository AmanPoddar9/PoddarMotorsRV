'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaSpinner, FaCheckCircle, FaMoneyBill } from 'react-icons/fa'

export default function RenewalModal({ isOpen, onClose, policyId, onSuccess }) {
  const [loading, setLoading] = useState(false)
  
  // New Policy Details
  const [formData, setFormData] = useState({
      newPolicyNumber: '',
      newPolicyStartDate: '',
      newPolicyEndDate: '',
      insurer: '',
      premiumAmount: '',
      paymentMode: 'UPI',
      paymentTxnRef: ''
  })

  // Prefill dates?
  useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      nextYear.setDate(nextYear.getDate() - 1); // Exact year minus 1 day
      const nextYearStr = nextYear.toISOString().split('T')[0];

      setFormData(prev => ({
          ...prev,
          newPolicyStartDate: today,
          newPolicyEndDate: nextYearStr
      }))
  }, [])

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.newPolicyNumber || !formData.premiumAmount) {
        alert('Please fill mandatory fields')
        return;
    }

    setLoading(true)
    try {
        await axios.post(`${API_URL}/api/insurance/policies/${policyId}/renew`, formData, { withCredentials: true })
        alert('Policy Renewed Successfully! New Term Created.')
        onSuccess()
    } catch (error) {
        console.error(error)
        alert(error.response?.data?.message || 'Error renewing policy')
    } finally {
        setLoading(false)
    }
  }
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg border border-green-500/30 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaMoneyBill className="text-green-400"/>
                Close & Renew Policy
            </h3>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-white" /></button>
        </div>
        
        <div className="bg-blue-900/20 p-4 rounded mb-6 text-sm text-blue-200 border border-blue-500/20">
            <strong>Note:</strong> This will close the current policy as "Renewed" and create a <u>new policy document</u> for the next year.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Policy Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">New Policy Number *</label>
                    <input name="newPolicyNumber" required onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white font-mono" placeholder="e.g. PM-2026-XYZ" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Premium Collected *</label>
                    <input name="premiumAmount" type="number" required onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" placeholder="₹ Amount" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">New Start Date</label>
                    <input name="newPolicyStartDate" type="date" required value={formData.newPolicyStartDate} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">New End Date</label>
                    <input name="newPolicyEndDate" type="date" required value={formData.newPolicyEndDate} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" />
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Insurer (Optional)</label>
                <input name="insurer" onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" placeholder="If changed..." />
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-700 pt-4 mt-2">
                <h4 className="text-sm font-bold text-gray-300 mb-2">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Payment Mode</label>
                        <select name="paymentMode" onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm">
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="NetBanking">Net Banking</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Txn / Cheque Ref</label>
                        <input name="paymentTxnRef" onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm" placeholder="Optional" />
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-4 shadow-lg shadow-green-900/20"
            >
                {loading ? <FaSpinner className="animate-spin" /> : 'Confirm Renewal'}
            </button>
        </form>
      </div>
    </div>
  )
}
