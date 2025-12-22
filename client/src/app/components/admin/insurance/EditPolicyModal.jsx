'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaSpinner, FaSave } from 'react-icons/fa'

export default function EditPolicyModal({ isOpen, onClose, policy, onSuccess }) {
  const [formData, setFormData] = useState({
      policyEndDate: '',
      renewalStage: '',
      renewalStatus: '',
      policyNumber: '',
      nextFollowUpDate: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      if (policy) {
          setFormData({
              policyEndDate: policy.policyEndDate ? new Date(policy.policyEndDate).toISOString().split('T')[0] : '',
              renewalStage: policy.renewalStage || 'New',
              renewalStatus: policy.renewalStatus || 'Pending',
              policyNumber: policy.policyNumber,
              nextFollowUpDate: policy.nextFollowUpDate ? new Date(policy.nextFollowUpDate).toISOString().split('T')[0] : '',
              // New Fields
              regNumber: policy.vehicle?.regNumber || '',
              make: policy.vehicle?.make || '',
              model: policy.vehicle?.model || '',
              ncb: policy.ncb || 0,
              claimDetails: policy.claimDetails || ''
          })
      }
  }, [policy])

  const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
          // Construct Payload
          const payload = {
              policyEndDate: formData.policyEndDate,
              renewalStage: formData.renewalStage,
              renewalStatus: formData.renewalStatus,
              policyNumber: formData.policyNumber,
              nextFollowUpDate: formData.nextFollowUpDate || null,
              ncb: Number(formData.ncb),
              claimDetails: formData.claimDetails,
              // Flatten vehicle updates for Mongoose (requires backend to handle dot notation or we send object carefully)
              // Since controller uses req.body directly, we must be careful.
              // SAFEST: Send dot notation keys if backend supports it directly via findByIdAndUpdate
              // BUT express body parser gives objects.
              // So we send 'vehicle': { ...merged }? No, that replaces.
              // Let's rely on Mongoose's ability to handle what we send.
              // Update: We will send "vehicle.regNumber": ...
              "vehicle.regNumber": formData.regNumber,
              "vehicle.make": formData.make,
              "vehicle.model": formData.model
          }
          
          await axios.patch(`${API_URL}/api/insurance/policies/${policy._id}`, payload, { withCredentials: true })
          
          alert('Policy Updated')
          onSuccess()
          onClose()
      } catch (error) {
          console.error(error)
          alert('Failed to update policy')
      } finally {
          setLoading(false)
      }
  }

  if (!isOpen) return null

  const stages = [
    'New', 'Contacted', 'FollowUp', 'QuoteSent', 'Negotiation', 
    'Accepted', 'PaymentPending', 'PaymentReceived', 'PolicyIssued', 'Closed'
  ]

  const statuses = ['Pending', 'InProgress', 'Renewed', 'Lost', 'NotInterested']

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Edit Policy Details
            </h3>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
                <label className="block text-xs text-gray-500 mb-1">Policy Number</label>
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono"
                    value={formData.policyNumber}
                    onChange={e => setFormData({...formData, policyNumber: e.target.value})}
                />
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">Vehicle Details</label>
                <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-[10px] text-gray-500">Reg Number</label>
                        <input 
                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-sm"
                            value={formData.regNumber}
                            onChange={e => setFormData({...formData, regNumber: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-500">Make</label>
                        <input 
                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-sm"
                            value={formData.make}
                            onChange={e => setFormData({...formData, make: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500">Model</label>
                        <input 
                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-sm"
                            value={formData.model}
                            onChange={e => setFormData({...formData, model: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Financials */}
            <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">Financials</label>
                <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-[10px] text-gray-500">NCB (%)</label>
                        <input 
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-sm"
                            value={formData.ncb}
                            onChange={e => setFormData({...formData, ncb: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-500">Claim History</label>
                        <input 
                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-sm"
                            placeholder="e.g. 1 Claim last year"
                            value={formData.claimDetails}
                            onChange={e => setFormData({...formData, claimDetails: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Renewal Status</label>
                    <select 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                        value={formData.renewalStatus}
                        onChange={e => setFormData({...formData, renewalStatus: e.target.value})}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Renewal Stage</label>
                    <select 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                        value={formData.renewalStage}
                        onChange={e => setFormData({...formData, renewalStage: e.target.value})}
                    >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs text-blue-300 mb-1">Next Follow-up Date</label>
                <input 
                    type="date"
                    className="w-full bg-gray-900 border border-blue-500/30 rounded p-2 text-white"
                    value={formData.nextFollowUpDate}
                    onChange={e => setFormData({...formData, nextFollowUpDate: e.target.value})}
                />
            </div>

            <div className="bg-red-900/10 p-3 rounded border border-red-500/20 mt-4">
                <label className="block text-xs text-red-300 mb-1 font-bold">Policy End Date (Correction)</label>
                <input 
                    type="date"
                    className="w-full bg-gray-900 border border-red-500/30 rounded p-2 text-white"
                    value={formData.policyEndDate}
                    onChange={e => setFormData({...formData, policyEndDate: e.target.value})}
                />
                <p className="text-[10px] text-gray-500 mt-1">Changing this will move the policy to the correct timeline bucket.</p>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-4"
            >
                {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Update Policy</>}
            </button>
        </form>
      </div>
    </div>
  )
}
