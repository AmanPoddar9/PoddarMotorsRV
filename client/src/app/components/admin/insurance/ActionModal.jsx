'use client'
import { useState } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import RenewalModal from './RenewalModal'

export default function ActionModal({ isOpen, onClose, policyId, actionType, onSuccess }) {
  const [outcome, setOutcome] = useState('')
  const [remark, setRemark] = useState('')
  const [nextFollowUp, setNextFollowUp] = useState('')
  const [lostReason, setLostReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRenewalModal, setShowRenewalModal] = useState(false)

  if (!isOpen) return null
  if (showRenewalModal) {
      return <RenewalModal 
          isOpen={true} 
          onClose={() => { onClose(); onSuccess(); }} 
          policyId={policyId} 
          onSuccess={() => { onClose(); onSuccess(); }}
      />
  }

  // --- LOGIC ---
  const isFollowUpRequired = outcome === 'CallbackLater' || outcome === 'Call Back Later'
  const isLost = outcome === 'NotInterested' || outcome === 'RenewedElsewhere' || outcome === 'Not Interested'
  const isRenewed = outcome === 'Renewed'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (isFollowUpRequired && !nextFollowUp) {
        alert('Please select a Follow-up Date')
        return
    }
    if (isLost && !lostReason && outcome !== 'NotInterested') {
         // Maybe enforce lost reason?
    }
    
    // If Renewed selected, switch to Renewal Modal
    if (isRenewed) {
        setShowRenewalModal(true)
        return
    }

    setLoading(true)
    try {
        await axios.post(`${API_URL}/api/insurance/policies/${policyId}/interaction`, {
            type: actionType === 'call' ? 'Call' : 'WhatsApp',
            outcome,
            remark,
            nextFollowUpDate: nextFollowUp || null,
            lostReason: isLost ? lostReason : null
        }, { 
            withCredentials: true 
        })
        
        onSuccess()
        onClose()
    } catch (error) {
        alert('Error logging action')
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  // Outcome Options
  const outcomes = [
     { value: 'Ringing', label: 'Ringing / No Answer' },
     { value: 'CallbackLater', label: 'Call Back Later' },
     { value: 'Contacted', label: 'Contacted / Interested' },
     { value: 'QuoteSent', label: 'Quote Sent' },
     { value: 'Negotiation', label: 'Negotiation' },
     { value: 'Accepted', label: 'Accepted' },
     { value: 'PaymentLinkSent', label: 'Payment Link Sent' },
     { value: 'Renewed', label: 'Renewed (Close & Create New)' },
     { value: 'NotInterested', label: 'Not Interested' },
     { value: 'RenewedElsewhere', label: 'Lost to Competitor' },
     { value: 'WrongNumber', label: 'Wrong Number' }
  ]

  const lostReasons = [
      'PriceTooHigh', 'RenewedElsewhere', 'VehicleSold', 'NoResponse', 'BadExperience', 'Other'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                {actionType === 'whatsapp' ? 'WhatsApp Log' : 'Call Log'}
            </h3>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Outcome <span className="text-red-400">*</span></label>
                <select 
                    required 
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={outcome} 
                    onChange={e => setOutcome(e.target.value)}
                >
                    <option value="">Select Outcome...</option>
                    {outcomes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            {/* Conditional: Lost Reason */}
            {isLost && (
                <div className="bg-red-900/10 p-3 rounded border border-red-500/20">
                    <label className="block text-sm text-red-300 mb-1">Lost Reason</label>
                    <select 
                        required 
                        className="w-full bg-gray-900 border border-red-500/30 text-white rounded p-2"
                        value={lostReason} 
                        onChange={e => setLostReason(e.target.value)}
                    >
                        <option value="">Why did we lose?</option>
                        {lostReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            )}

            {/* Conditional: Follow Up */}
            <div className={`transition-all ${isFollowUpRequired ? 'bg-blue-900/10 p-3 rounded border border-blue-500/30' : ''}`}>
                <label className="block text-sm text-gray-400 mb-1">
                    Next Follow-up {isFollowUpRequired && <span className="text-red-400">*</span>}
                </label>
                <input 
                    type="datetime-local" 
                    required={isFollowUpRequired}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    value={nextFollowUp} 
                    onChange={e => setNextFollowUp(e.target.value)} 
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Remark <span className="text-red-400">*</span></label>
                <textarea 
                    required 
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 h-20 focus:ring-2 focus:ring-blue-500" 
                    placeholder="Brief notes about the conversation..." 
                    value={remark} 
                    onChange={e => setRemark(e.target.value)} 
                />
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className={`w-full font-bold py-3 rounded flex justify-center items-center gap-2 transition ${
                    isRenewed ? 'bg-green-600 hover:bg-green-700' :
                    isLost ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {loading ? <FaSpinner className="animate-spin" /> : (
                    isRenewed ? 'Proceed to Renewal' : 'Save Log'
                )}
            </button>
        </form>
      </div>
    </div>
  )
}
