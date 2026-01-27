'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaTimes, FaPhone, FaHistory, FaPlus, FaSpinner, FaWhatsapp, FaEdit, FaClipboardList } from 'react-icons/fa'
import RenewalModal from './RenewalModal'
import ActionModal from './ActionModal'
import EditPolicyModal from './EditPolicyModal'

export default function CustomerDetailModal({ isOpen, onClose, customerId }) {
  const [customer, setCustomer] = useState(null)
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal States
  const [selectedPolicyId, setSelectedPolicyId] = useState(null)
  const [showRenewalModal, setShowRenewalModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false) // Unified Action Modal
  const [editingPolicy, setEditingPolicy] = useState(null) // Manual Edit
  const [actionType, setActionType] = useState('call') // call, whatsapp
  
  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', mobile: '', alternatePhones: '' })
  const [saveLoading, setSaveLoading] = useState(false)

  const handleSaveProfile = async () => {
      setSaveLoading(true)
      try {
          const payload = {
              ...editForm,
              alternatePhones: editForm.alternatePhones.split(',').map(p => p.trim()).filter(p => p)
          }
          await axios.patch(`${API_URL}/api/insurance/customers/${customer._id}`, payload, { withCredentials: true })
          setIsEditingProfile(false)
          fetchData() // Refresh
      } catch (error) {
          alert(error.response?.data?.message || 'Error updating profile')
      } finally {
          setSaveLoading(false)
      }
  }

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

  useEffect(() => {
      if (customer) {
          setEditForm({ 
              name: customer.name, 
              mobile: customer.mobile,
              alternatePhones: (customer.alternatePhones || []).join(', ')
          })
      }
  }, [customer])

  const openActionInput = (policyId, type) => {
      setSelectedPolicyId(policyId)
      setActionType(type)
      setShowActionModal(true)
  }

  if (!isOpen) return null
  
  // Render Modals
  if (showRenewalModal && selectedPolicyId) {
      return <RenewalModal 
         isOpen={true} 
         onClose={() => setShowRenewalModal(false)}
         policyId={selectedPolicyId}
         onSuccess={() => { setShowRenewalModal(false); fetchData(); }}
      />
  }

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-end bg-black/60 backdrop-blur-sm">
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
             <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 relative">
                {/* Header Actions */}
                <div className="absolute top-4 right-4">
                    <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)} 
                        className="text-gray-400 hover:text-white p-2"
                        title="Edit Profile"
                    >
                        <FaEdit />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {customer.name[0]}
                    </div>
                    <div className="flex-1">
                        {isEditingProfile ? (
                            <div className="space-y-2">
                                <input 
                                    className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-full"
                                    value={editForm.name}
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                    placeholder="Name"
                                />
                                <input 
                                    className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-full"
                                    value={editForm.mobile}
                                    onChange={e => setEditForm({...editForm, mobile: e.target.value})}
                                    placeholder="Mobile"
                                />
                                <input 
                                    className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-full"
                                    value={editForm.alternatePhones}
                                    onChange={e => setEditForm({...editForm, alternatePhones: e.target.value})}
                                    placeholder="Alternate Numbers (comma separated)"
                                />
                                <div className="flex gap-2 mt-1">
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={saveLoading}
                                        className="bg-blue-600 text-xs px-3 py-1 rounded text-white"
                                    >
                                        {saveLoading ? 'Saving...' : 'Save'}
                                    </button>
                                     <button 
                                        onClick={() => setIsEditingProfile(false)}
                                        className="bg-gray-700 text-xs px-3 py-1 rounded text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                                <p className="text-gray-400 font-mono text-sm">{customer.customId}</p>
                            </>
                        )}
                    </div>
                </div>
                
                {!isEditingProfile && (
                    <div className="grid grid-cols-2 gap-4">
                        <a href={`tel:${customer.mobile}`} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white transition">
                            <FaPhone className="text-green-400" />
                            <span>{customer.mobile}</span>
                        </a>
                        <button 
                            onClick={() => {
                                // Robust Sanitization for Quick Link
                                let clean = customer.mobile.toString().replace(/\D/g, '');
                                if (clean.length > 10 && clean.startsWith('91')) clean = clean.substring(2);
                                if (clean.length === 11 && clean.startsWith('0')) clean = clean.substring(1);
                                window.open(`https://wa.me/91${clean}`, '_blank');
                            }}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white transition"
                        >
                            <FaWhatsapp className="text-green-500" />
                            <span>WhatsApp</span>
                        </button>
                    </div>
                )}

                {!isEditingProfile && customer.alternatePhones && customer.alternatePhones.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {customer.alternatePhones.map((phone, i) => (
                            <a key={i} href={`tel:${phone}`} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 transition flex items-center gap-1">
                                <FaPhone size={8} /> {phone}
                            </a>
                        ))}
                    </div>
                )}

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
                        <FaClipboardList className="text-purple-500" /> Active Policies
                    </h3>
                    <div className="grid gap-4">
                        {customer.policies.map(policy => (
                            <div key={policy._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <div className="flex justify-between items-start mb-3">
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
                                    </div>
                                    <button 
                                        onClick={() => setEditingPolicy(policy)}
                                        className="text-yellow-500 hover:text-yellow-400 p-1"
                                        title="Manually Edit Policy"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                     <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                        Stage: {policy.renewalStage || 'New'}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                        Exp: {new Date(policy.policyEndDate).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                     <button 
                                        onClick={() => openActionInput(policy._id, 'call')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-1"
                                     >
                                         <FaPhone size={10} /> Call Log
                                     </button>
                                     <button 
                                        onClick={() => openActionInput(policy._id, 'whatsapp')}
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-1"
                                     >
                                         <FaWhatsapp size={12} /> WhatsApp
                                     </button>
                                     <button 
                                        onClick={() => { setSelectedPolicyId(policy._id); setShowRenewalModal(true); }}
                                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded col-span-2"
                                     >
                                        Renew Policy Area
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {/* Unified Interaction History */}
             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaHistory className="text-blue-500" /> History
                </h3>
                
                <div className="space-y-6 border-l-2 border-gray-800 pl-6 ml-2">
                    {interactions.map((int) => (
                        <div key={int._id} className="relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-gray-600 border-2 border-gray-900"></div>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${int.type === 'Call' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'}`}>
                                        {int.type || 'Log'}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(int.date).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-300 text-sm mt-1">{int.data?.remark}</p>
                                
                                <div className="flex gap-2 mt-2">
                                    {int.data?.outcome && (
                                         <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                            Outcome: {int.data.outcome}
                                         </span>
                                    )}
                                    {int.data?.nextFollowUp && (
                                        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                            Next: {new Date(int.data.nextFollowUp).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-600 mt-2">By {int.agentName}</div>
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

        <ActionModal 
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            policyId={selectedPolicyId}
            actionType={actionType}
            onSuccess={() => { fetchData() }}
        />

        <EditPolicyModal 
            isOpen={!!editingPolicy}
            policy={editingPolicy}
            onClose={() => setEditingPolicy(null)}
            onSuccess={() => { fetchData() }}
        />

      </div>
    </div>
  )
}
