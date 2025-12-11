'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaPhone, FaHistory, FaPlus, FaSpinner, FaWhatsapp } from 'react-icons/fa'

export default function CustomerDetailModal({ isOpen, onClose, customerId }) {
  const [customer, setCustomer] = useState(null)
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // New Interaction State
  const [remark, setRemark] = useState('')
  const [nextDate, setNextDate] = useState('')
  const [addingRemark, setAddingRemark] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [custRes, intRes] = await Promise.all([
        axios.get(`${API_URL}/api/insurance/customers/${customerId}`, { withCredentials: true }),
        axios.get(`${API_URL}/api/insurance/interactions/${customerId}`, { withCredentials: true })
      ])
      setCustomer(custRes.data)
      setInteractions(intRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && customerId) {
        fetchData()
    }
  }, [isOpen, customerId])

  const handleAddRemark = async (e) => {
    e.preventDefault()
    if (!remark) return
    setAddingRemark(true)
    try {
        await axios.post(`${API_URL}/api/insurance/interactions`, {
            customerId,
            remark,
            nextFollowUp: nextDate || null
        }, { withCredentials: true })
        
        setRemark('')
        setNextDate('')
        fetchData() // Refresh list
    } catch (error) {
        alert('Failed to add remark')
    } finally {
        setAddingRemark(false)
    }
  }

  // Action State
  const [actionPolicy, setActionPolicy] = useState(null)
  const [actionType, setActionType] = useState(null) // 'renew', 'lost'
  const [formInputs, setFormInputs] = useState({}) 
  const [submittingAction, setSubmittingAction] = useState(false)

  const handleRenewClick = (policy) => {
      setActionPolicy(policy)
      setActionType('renew')
      setFormInputs({ 
          insurer: policy.insurer, 
          premium: '', 
          idv: '',
          paymentDate: new Date().toISOString().split('T')[0]
      })
  }

  const handleLostClick = (policy) => {
      setActionPolicy(policy)
      setActionType('lost')
      setFormInputs({ reason: '', remark: '' })
  }

  const submitAction = async () => {
      if (!actionPolicy) return
      setSubmittingAction(true)
      try {
          if (actionType === 'renew') {
            await axios.post(`${API_URL}/api/insurance/policies/${actionPolicy._id}/renew`, {
                insurer: formInputs.insurer,
                premium: formInputs.premium,
                idv: formInputs.idv,
                paymentDate: formInputs.paymentDate,
                renewalDate: new Date()
            }, { withCredentials: true })
          } else {
             await axios.post(`${API_URL}/api/insurance/policies/${actionPolicy._id}/lost`, {
                reason: formInputs.reason,
                remark: formInputs.remark
             }, { withCredentials: true })
          }
          alert('Success')
          setActionPolicy(null)
          fetchData()
      } catch (err) {
          alert(err.response?.data?.message || 'Failed')
      } finally {
          setSubmittingAction(false)
      }
  }

  if (!isOpen) return null

  // Render Action Modal Overlay
  if (actionPolicy) {
      return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">
                      {actionType === 'renew' ? 'Renew Policy' : 'Mark as Lost'}
                  </h3>
                  
                  <div className="space-y-4">
                      {actionType === 'renew' ? (
                          <>
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" 
                                placeholder="New Insurer"
                                value={formInputs.insurer}
                                onChange={e => setFormInputs({...formInputs, insurer: e.target.value})}
                            />
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" 
                                placeholder="Premium Amount"
                                type="number"
                                value={formInputs.premium}
                                onChange={e => setFormInputs({...formInputs, premium: e.target.value})}
                            />
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" 
                                placeholder="New IDV"
                                type="number"
                                value={formInputs.idv}
                                onChange={e => setFormInputs({...formInputs, idv: e.target.value})}
                            />
                             <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" 
                                type="date"
                                title="Payment Date"
                                value={formInputs.paymentDate}
                                onChange={e => setFormInputs({...formInputs, paymentDate: e.target.value})}
                            />
                          </>
                      ) : (
                          <>
                             <select 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                value={formInputs.reason}
                                onChange={e => setFormInputs({...formInputs, reason: e.target.value})}
                             >
                                 <option value="">Select Reason</option>
                                 <option value="Too Expensive">Too Expensive</option>
                                 <option value="Sold Vehicle">Sold Vehicle</option>
                                 <option value="Bought Elsewhere">Bought Elsewhere</option>
                                 <option value="Unreachable">Unreachable</option>
                             </select>
                             <textarea 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" 
                                placeholder="Additional Remarks"
                                value={formInputs.remark}
                                onChange={e => setFormInputs({...formInputs, remark: e.target.value})}
                            />
                          </>
                      )}
                  </div>

                  <div className="flex gap-3 mt-6 justify-end">
                      <button onClick={() => setActionPolicy(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                      <button 
                        onClick={submitAction}
                        disabled={submittingAction}
                        className={`px-6 py-2 rounded-lg font-bold text-white ${actionType === 'renew' ? 'bg-green-600' : 'bg-red-600'}`}
                      >
                          {submittingAction ? 'Processing...' : 'Confirm'}
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border-l border-gray-700 w-full max-w-lg h-full shadow-2xl overflow-y-auto transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-white">Customer Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
            </button>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <FaSpinner className="animate-spin text-blue-500 text-3xl" />
           </div>
        ) : customer ? (
           <div className="p-6 space-y-8">
             {/* Identity Card */}
             <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {customer.name[0]}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                        <p className="text-gray-400 font-mono text-sm">{customer.customId}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <a href={`tel:${customer.mobile}`} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white transition">
                        <FaPhone className="text-green-400" />
                        <span>{customer.mobile}</span>
                    </a>
                    <a href={`https://wa.me/91${customer.mobile}`} target="_blank" className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white transition">
                        <FaWhatsapp className="text-green-500" />
                        <span>WhatsApp</span>
                    </a>
                </div>

                {customer.vehicles?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Vehicles</p>
                        <div className="flex flex-wrap gap-2">
                            {customer.vehicles.map((v, i) => (
                                <span key={i} className="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm border border-gray-700">
                                    {v.regNumber} ({v.model})
                                </span>
                            ))}
                        </div>
                    </div>
                )}
             </div>

             {/* Policies Section */}
             {customer.policies && customer.policies.length > 0 && (
                 <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FaHistory className="text-purple-500" /> Active Policies
                    </h3>
                    <div className="grid gap-4">
                        {customer.policies.map(policy => (
                            <div key={policy._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        {policy.vehicle?.regNumber} 
                                        <span className={`text-xs px-2 py-0.5 rounded ${policy.renewalStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {policy.renewalStatus || policy.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {policy.policyNumber} &bull; {policy.insurer}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Exp: {new Date(policy.policyEndDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {(policy.renewalStatus === 'Pending' || policy.renewalStatus === 'InProgress' || policy.status === 'Active') && (
                                        <>
                                            <button 
                                                onClick={() => handleRenewClick(policy)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-bold"
                                            >
                                                Renew
                                            </button>
                                            <button 
                                                onClick={() => handleLostClick(policy)}
                                                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 text-xs rounded font-bold"
                                            >
                                                Mark Lost
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}
             
             {/* Modals for Actions can go here or be sub-components. For simplicity, using prompt/inline for now or expanding state */}
             {/* To do it properly, we need state for active action */}

             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaHistory className="text-blue-500" /> Interaction History
                </h3>
                
                {/* Add Remark Form */}
                <form onSubmit={handleAddRemark} className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Add call notes or remarks..."
                        rows="2"
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                    ></textarea>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 block mb-1">Next Follow-up</label>
                            <input 
                                type="date"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm"
                                value={nextDate}
                                onChange={e => setNextDate(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={addingRemark || !remark}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 h-10 mt-5"
                        >
                            {addingRemark ? '...' : 'Add'}
                        </button>
                    </div>
                </form>

                {/* Timeline */}
                <div className="space-y-6 border-l-2 border-gray-800 pl-6 ml-2">
                    {interactions.map((int) => (
                        <div key={int._id} className="relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-gray-600 border-2 border-gray-900"></div>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
                                <p className="text-gray-300 text-sm whitespace-pre-wrap">{int.data?.remark}</p>
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                    <span>{int.agentName}</span>
                                    <span>{new Date(int.date).toLocaleString()}</span>
                                </div>
                                {int.data?.nextFollowUp && (
                                    <div className="mt-2 text-xs font-bold text-yellow-500 bg-yellow-500/10 inline-block px-2 py-1 rounded">
                                        F/Up: {new Date(int.data.nextFollowUp).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {interactions.length === 0 && (
                        <p className="text-gray-500 text-sm">No interactions recorded yet.</p>
                    )}
                </div>
             </div>
           </div>
        ) : (
            <div className="p-6 text-center text-red-400">Error loading customer</div>
        )}
      </div>
    </div>
  )
}
