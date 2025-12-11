'use client'

import { useState } from 'react'
import axios from 'axios'
import { getAPIURL } from '@/app/config/api'
import { FaSearch, FaTimes, FaSpinner, FaUserPlus, FaFileAlt } from 'react-icons/fa'

export default function AddPolicyModal({ isOpen, onClose }) {
  // Step 1: Customer Search
  // Step 2: Policy Details
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [error, setError] = useState(null)
  
  // Step 2 Form
  const [formData, setFormData] = useState({
    policyNumber: '',
    insurer: '',
    expiryDate: '',
    previousIDV: '',
    premiumAmount: '',
    coverageType: 'Comprehensive',
    regNumber: '',
    make: '',
    model: '',
    year: '',
    // If New Customer
    customerName: '',
    customerMobile: '',
    customerEmail: ''
  })
  
  const [submitting, setSubmitting] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery) return
    setSearching(true)
    try {
      const API_URL = getAPIURL(); // Get URL at runtime
      const res = await axios.get(`${API_URL}/api/insurance/customers/search`, {
        params: { query: searchQuery },
        withCredentials: true
      })
      setSearchResults(res.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setSearchResults([])
      setError(err.response?.data?.message || 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setStep(2)
  }

  const handleNewCustomer = () => {
    setSelectedCustomer(null) // New
    // Pre-fill mobile if query was a number
    if (/^\d{10}$/.test(searchQuery)) {
        setFormData(prev => ({ ...prev, customerMobile: searchQuery }))
    }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
        ...formData,
        existingCustomerId: selectedCustomer?._id || null
    }

    try {
        const API_URL = getAPIURL(); // Get URL at runtime
        await axios.post(`${API_URL}/api/insurance/policies`, payload, { withCredentials: true })
        onClose() // Success
    } catch (error) {
        alert('Error creating policy: ' + error.response?.data?.message || error.message)
    } finally {
        setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? 'Find Customer' : 'Add Policy Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Enter name, mobile, or vehicle no..."
                  className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
                <button 
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
                >
                  {searching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                </button>
              </div>

              {/* Results */}
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map(customer => (
                  <div 
                    key={customer._id}
                    onClick={() => { setSelectedCustomer(customer); setStep(2); }}
                    className="bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="font-bold text-white">{customer.name}</div>
                    <div className="text-sm text-gray-400">{customer.mobile} {customer.email && `• ${customer.email}`}</div>
                    {customer.vehicles?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            {customer.vehicles.map(v => v.regNumber).join(', ')}
                        </div>
                    )}
                  </div>
                ))}
                
                {searchResults.length === 0 && searchQuery && !searching && !error && (
                    <div className="text-center py-4 text-gray-400">
                        No customers found. 
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-4 text-red-400 bg-red-400/10 rounded-lg">
                        {error}
                    </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button 
                  onClick={handleNewCustomer}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5 transition font-bold flex items-center justify-center gap-2"
                >
                  <FaUserPlus /> Create New Customer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Context */}
              <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
                {selectedCustomer ? (
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white">
                            {selectedCustomer.name[0]}
                        </div>
                        <div>
                            <p className="text-sm text-blue-200">Adding policy for</p>
                            <p className="font-bold text-white">{selectedCustomer.name}</p>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-blue-400 underline">Change</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-blue-200 font-bold mb-2">New Customer Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="Full Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" />
                            <input required placeholder="Mobile Number" value={formData.customerMobile} onChange={e => setFormData({...formData, customerMobile: e.target.value})} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" />
                        </div>
                    </div>
                )}
              </div>

              {/* Vehicle Section */}
               <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input required placeholder="Reg Number (UP16...)" className="col-span-2 bg-gray-900 border border-gray-700 text-white rounded px-3 py-2 uppercase" value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value.toUpperCase()})} />
                    <input required placeholder="Model (e.g. Swift)" className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                    <input placeholder="Year" className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
              </div>

              {/* Policy Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Policy Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Policy Number" className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.policyNumber} onChange={e => setFormData({...formData, policyNumber: e.target.value})} />
                    <input required placeholder="Insurer (e.g. HDFC)" className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.insurer} onChange={e => setFormData({...formData, insurer: e.target.value})} />
                    
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-400 block mb-1">Expiry Date</label>
                        <input required type="date" className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-400 block mb-1">Premium Amount</label>
                        <input type="number" placeholder="₹" className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={formData.premiumAmount} onChange={e => setFormData({...formData, premiumAmount: e.target.value})} />
                    </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600">Back</button>
                <button type="submit" disabled={submitting} className="flex-1 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center">
                    {submitting ? <FaSpinner className="animate-spin" /> : 'Save Policy'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
