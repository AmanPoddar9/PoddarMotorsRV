'use client'
import { useState } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import RenewalModal from './RenewalModal'

export default function ActionModal({ isOpen, onClose, policyId, actionType, mobile, onSuccess }) {
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

  // --- TEMPLATES ---
  const templates = [
      { id: '30Day', label: '30 Day Reminder', outcome: '30DayReminder', text: "Hi, This is a gentle reminder that your car insurance is expiring in 30 days. Let us know if you'd like to renew." },
      { id: '15Day', label: '15 Day Reminder', outcome: '15DayReminder', text: "Hi, Your car insurance expires in 15 days. Avoid last minute hassle and renew today." },
      { id: '7Day', label: '7 Day Reminder', outcome: '7DayReminder', text: "Hi, 7 Days left! Please renew your insurance to ensure continuous coverage." },
      { id: '1Day', label: 'Expiring Tomorrow (Urgent)', outcome: '1DayReminder', text: "URGENT: Your policy expires tomorrow. Please renew immediately to prevent inspection charges." },
      { id: 'Due', label: 'Due Today', outcome: '1DayReminder', text: "Your Policy expires TODAY. Renew now." },
      { id: 'Quote', label: 'Quote Sent', outcome: 'QuoteSent', text: "Shared the quotation as requested. Please check and let me know." },
      { id: 'Issued', label: 'Policy Issued', outcome: 'PolicyIssued', text: "Congratulations! Your policy has been issued. Sharing the PDF shortly." },
  ]

  const handleTemplateChange = (e) => {
      const t = templates.find(t => t.id === e.target.value);
      if(t) {
          setOutcome(t.outcome);
          setRemark(t.text);
          // Auto-set Follow up?
          if(t.id.includes('Day')) {
               // setNextFollowUp logic if we want to be fancy
          }
      }
  }

  const handleSendAndLog = async (e) => {
      e.preventDefault();
      
      let finalOutcome = outcome;
      if (actionType === 'whatsapp') {
          finalOutcome = 'WhatsApp Message Sent'; // Force default
          setOutcome(finalOutcome); // Update state for handleSubmit
      }

      // 1. Open WhatsApp
      if (actionType === 'whatsapp' && mobile) {
          // Sanitize mobile: remove country code +91 if present to avoid double, remove spaces
          let cleanMobile = mobile.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^91/, '');
          
          if (cleanMobile.length === 10) {
              const text = encodeURIComponent(remark);
              const url = `https://wa.me/91${cleanMobile}?text=${text}`;
              
              // Open in new tab
              const win = window.open(url, '_blank');
              if (win) {
                  win.focus();
              } else {
                  alert('Please allow popups for WhatsApp');
              }
          } else {
              alert('Invalid Mobile Number for WhatsApp');
              return; // Don't log if invalid? Or log anyway? Let's log anyway but warn user.
          }
      }
      
      // Delay submit slightly to allow window.open to fire? No need if sync.
      handleSubmit(e, finalOutcome); 
  }

  // --- LOGIC ---
  const isFollowUpRequired = outcome === 'CallbackLater' || outcome === 'Call Back Later'
  const isLost = outcome === 'NotInterested' || outcome === 'RenewedElsewhere' || outcome === 'Not Interested'
  const isRenewed = outcome === 'Renewed'

  const handleSubmit = async (e, forcedOutcome = null) => {
    e.preventDefault()
    
    const submitOutcome = forcedOutcome || outcome; // Use forced or state

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
            outcome: submitOutcome,
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
            {/* Outcome Selector (Hidden for WhatsApp) */}
            {actionType !== 'whatsapp' && (
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
            )}

            {/* Template Selector for WhatsApp */}
            {actionType === 'whatsapp' && (
                 <div className="bg-green-900/10 p-3 rounded border border-green-500/20 mb-4">
                    <label className="block text-sm text-green-300 mb-1 font-bold">Quick Template</label>
                    <select 
                        className="w-full bg-gray-900 border border-green-500/30 text-white rounded p-2"
                        onChange={handleTemplateChange}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a Template...</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                </div>
            )}

            {/* ... (Lost Reason & Follow Up - specific conditions) ... */}

            {/* Conditional: Lost Reason (Only if explicitly Lost selected in dropdown, usually via Call) */}
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
                    placeholder={actionType === 'whatsapp' ? "Message preview..." : "Brief notes about the conversation..."}
                    value={remark} 
                    onChange={e => setRemark(e.target.value)} 
                />
            </div>

            <button 
                onClick={actionType === 'whatsapp' ? handleSendAndLog : undefined}
                type={actionType === 'whatsapp' ? 'button' : 'submit'} 
                disabled={loading} 
                className={`w-full font-bold py-3 rounded flex justify-center items-center gap-2 transition ${
                    isRenewed ? 'bg-green-600 hover:bg-green-700' :
                    isLost ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : 
                    'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {loading ? <FaSpinner className="animate-spin" /> : (
                    isRenewed ? 'Proceed to Renewal' : (actionType === 'whatsapp' ? 'Open WhatsApp & Log' : 'Save Log')
                )}
            </button>
        </form>
      </div>
    </div>
  )
}
