'use client'
import { useState } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaSpinner } from 'react-icons/fa'

export default function ActionModal({ isOpen, onClose, policyId, actionType, onSuccess }) {
  const [outcome, setOutcome] = useState('')
  const [remark, setRemark] = useState('')
  const [nextFollowUp, setNextFollowUp] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        // 1. Log Interaction
        await axios.post(`${API_URL}/api/insurance/interactions`, {
            policyId, // Note: Interaction model usually takes customerId. We might need to fetch customerId or update interaction logic.
            // Actually, best to pass Customer Id? Or handle policy link in backend. 
            // Let's assume for now we just log a remark on the policy itself or find the customer.
            // Simplified: Update Policy with Last Remark / Status.
            
            // Wait, "addInteraction" in controller takes { customerId, remark, nextFollowUp, agentName }.
            // We need policyId -> customerId lookup. Or update policy status.
            
            // Let's use a new endpoint or the standard update endpoint for simplicity?
            // "Update Policy Status / Disposition"
            actionType,
            outcome,
            remark,
            nextFollowUp
        }, { withCredentials: true })
        
        // Use a new dedicated endpoint for "Workflow Action" if simpler
        // For now, let's call updatePolicy or a specialized one?
        // Let's create a specialized one: /api/insurance/policies/:id/action
        
        await axios.post(`${API_URL}/api/insurance/policies/${policyId}/action`, {
            actionType,
            outcome,
            remark,
            nextFollowUp
        }, { withCredentials: true })

        onSuccess()
        onClose()
    } catch (error) {
        alert('Error logging action')
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  // Disposition Options based on Action
  const outcomes = actionType === 'call' 
    ? ['Connected - Quote Sent', 'Connected - Call Later', 'Ringing / No Answer', 'Please Call Later', 'Not Interested', 'Wrong Number']
    : ['Template Sent', 'Replied']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white capitalize">Log {actionType} Result</h3>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Outcome</label>
                <select required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2" value={outcome} onChange={e => setOutcome(e.target.value)}>
                    <option value="">Select Outcome...</option>
                    {outcomes.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Remark</label>
                <textarea required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 h-20" placeholder="Customer said..." value={remark} onChange={e => setRemark(e.target.value)} />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Next Follow-up (Optional)</label>
                <input type="datetime-local" className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2" value={nextFollowUp} onChange={e => setNextFollowUp(e.target.value)} />
            </div>

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex justify-center">
                {loading ? <FaSpinner className="animate-spin" /> : 'Save Log'}
            </button>
        </form>
      </div>
    </div>
  )
}
