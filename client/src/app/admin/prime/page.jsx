'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCrown, FaSearch, FaTimes, FaClipboardList, FaCheck, FaPhone } from 'react-icons/fa'
import API_URL from '../../config/api'
import AdminNavbar from '../../components/AdminNavbar'

export default function PrimeMembershipsPage() {
  const [activeTab, setActiveTab] = useState('members') // 'members' or 'enquiries'
  
  // Members State
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive
  const [error, setError] = useState(null)

  // Edit Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [formData, setFormData] = useState({
    isActive: false,
    tier: 'Gold',
    expiryDate: '',
    expiryDate: '',
    benefits: '',
    servicesAvailed: []
  })
  const [saveLoading, setSaveLoading] = useState(false)

  // Enquiries State
  const [enquiries, setEnquiries] = useState([])
  const [enquiriesLoading, setEnquiriesLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'members') {
      fetchCustomers()
    } else {
      fetchEnquiries()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'members') {
      filterCustomers()
    }
  }, [customers, searchQuery, filterStatus, activeTab])

  // --- Members Functions ---

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`${API_URL}/api/customer/all`, { withCredentials: true })
      setCustomers(res.data.customers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError(error.response?.data?.message || 'Failed to load customers. Please ensure you are logged in as admin.')
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter(c => c.primeStatus?.isActive)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(c => !c.primeStatus?.isActive)
    }

    setFilteredCustomers(filtered)
  }

  const openEditModal = (customer) => {
    setSelectedCustomer(customer)
    const benefits = customer.primeStatus?.benefits?.join(', ') || ''
    setFormData({
      isActive: customer.primeStatus?.isActive || false,
      tier: customer.primeStatus?.tier || 'Gold',
      expiryDate: customer.primeStatus?.expiryDate 
        ? new Date(customer.primeStatus.expiryDate).toISOString().split('T')[0] 
        : '',
      benefits,
      servicesAvailed: customer.primeStatus?.servicesAvailed || []
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      const benefitsArray = formData.benefits
        ? formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
        : []

      await axios.put(
        `${API_URL}/api/customer/${selectedCustomer._id}/prime`,
        {
          isActive: formData.isActive,
          tier: formData.tier,
          expiryDate: formData.expiryDate || null,
          benefits: benefitsArray,
          servicesAvailed: formData.servicesAvailed
        },
        { withCredentials: true }
      )

      setModalOpen(false)
      fetchCustomers()
    } catch (error) {
      console.error('Error updating Prime status:', error)
      alert('Failed to update Prime status')
    } finally {
      setSaveLoading(false)
    }
  }

  // --- Enquiries Functions ---

  const fetchEnquiries = async () => {
    try {
      setEnquiriesLoading(true)
      const res = await axios.get(`${API_URL}/api/prime-enquiry`, { withCredentials: true })
      if (res.data.success) {
        setEnquiries(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setEnquiriesLoading(false)
    }
  }

  const updateEnquiryStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/prime-enquiry/${id}`, { status: newStatus }, { withCredentials: true })
      // Optimistic update
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: newStatus } : e))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-custom-black text-white">
      <AdminNavbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FaCrown className="text-custom-accent" />
              Prime Memberships
            </h1>
            
            {/* Tabs */}
            <div className="flex bg-custom-jet p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'members' 
                    ? 'bg-custom-accent text-custom-black shadow-lg' 
                    : 'text-custom-platinum hover:text-white'
                }`}
              >
                <FaCrown size={14} /> Active Members
              </button>
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'enquiries' 
                    ? 'bg-custom-accent text-custom-black shadow-lg' 
                    : 'text-custom-platinum hover:text-white'
                }`}
              >
                <FaClipboardList size={14} /> New Enquiries
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && activeTab === 'members' && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl p-4 mb-6">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Content Area */}
          <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden min-h-[400px]">
            
            {/* --- MEMBERS TAB --- */}
            {activeTab === 'members' && (
              <>
                {/* Filters */}
                <div className="p-4 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-platinum" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-custom-black border border-white/20 rounded-lg text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-custom-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-custom-accent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-custom-platinum">Loading members...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-custom-black border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Mobile</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Prime Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Tier</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Expiry</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-custom-platinum">No members found</td>
                          </tr>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <tr key={customer._id} className="border-b border-white/5 hover:bg-custom-black/50">
                              <td className="px-6 py-4 font-medium">{customer.name}</td>
                              <td className="px-6 py-4 text-custom-platinum">{customer.mobile}</td>
                              <td className="px-6 py-4">
                                {customer.primeStatus?.isActive ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Active
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {customer.primeStatus?.tier && (
                                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                    customer.primeStatus.tier === 'Platinum' 
                                      ? 'bg-slate-700 border-slate-500 text-white' 
                                      : 'bg-yellow-900/30 border-yellow-600 text-yellow-500'
                                  }`}>
                                    {customer.primeStatus.tier}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-custom-platinum text-sm">
                                {customer.primeStatus?.expiryDate 
                                  ? new Date(customer.primeStatus.expiryDate).toLocaleDateString()
                                  : '-'}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => openEditModal(customer)}
                                  className="text-custom-accent hover:text-white font-medium text-sm transition"
                                >
                                  Edit Status
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* --- ENQUIRIES TAB --- */}
            {activeTab === 'enquiries' && (
              <>
                {enquiriesLoading ? (
                  <div className="text-center py-12 text-custom-platinum">Loading enquiries...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-custom-black border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Car Details</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Plan Interest</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-custom-platinum">No new enquiries found</td>
                          </tr>
                        ) : (
                          enquiries.map((enquiry) => (
                            <tr key={enquiry._id} className="border-b border-white/5 hover:bg-custom-black/50">
                              <td className="px-6 py-4 text-custom-platinum text-sm">
                                {new Date(enquiry.createdAt).toLocaleDateString()}
                                <div className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleTimeString()}</div>
                              </td>
                              <td className="px-6 py-4 font-medium">{enquiry.name}</td>
                              <td className="px-6 py-4 text-sm text-custom-platinum">
                                <div><FaPhone className="inline mr-1 text-xs" />{enquiry.phone}</div>
                                {enquiry.email && <div className="text-xs text-gray-500 mt-1">{enquiry.email}</div>}
                              </td>
                              <td className="px-6 py-4 text-sm text-custom-platinum">
                                <div className="font-medium text-white">{enquiry.registrationNumber || '-'}</div>
                                <div className="text-xs">{enquiry.carModel || '-'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  enquiry.selectedPlan.includes('Platinum') 
                                    ? 'bg-slate-700 text-white' 
                                    : 'bg-yellow-900/30 text-yellow-500'
                                }`}>
                                  {enquiry.selectedPlan}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                  enquiry.status === 'New' ? 'bg-blue-500/20 text-blue-400' :
                                  enquiry.status === 'Contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                  enquiry.status === 'Converted' ? 'bg-green-500/20 text-green-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {enquiry.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={enquiry.status}
                                  onChange={(e) => updateEnquiryStatus(enquiry._id, e.target.value)}
                                  className="bg-custom-black border border-white/20 rounded px-2 py-1 text-xs text-white focus:border-custom-accent outline-none"
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Converted">Converted</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Modal (Only for Members tab) */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-custom-jet rounded-2xl border border-white/10 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Prime Status</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-custom-platinum hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">{selectedCustomer?.name}</p>
                  <p className="text-custom-platinum text-sm">{selectedCustomer?.mobile}</p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-custom-platinum bg-custom-black text-custom-accent focus:ring-custom-accent"
                  />
                  <label htmlFor="isActive" className="font-medium">Active Prime Membership</label>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-custom-accent"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-custom-accent"
                  />
                </div>

                {/* Benefits Management */}
                <div>
                  <label className="block text-sm font-medium mb-2">Entitled Benefits (comma-separated)</label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="E.g., Free Oil Change, Priority Service"
                    rows={2}
                    className="w-full px-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent resize-none text-sm"
                  />
                </div>

                {/* Service Tracking */}
                {formData.benefits && (
                  <div className="bg-custom-black/50 p-4 rounded-lg border border-white/10">
                    <h3 className="text-sm font-bold text-custom-accent mb-3 flex items-center gap-2">
                       <FaCheck /> Track Services Availed
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.benefits.split(',').map(b => b.trim()).filter(Boolean).map((benefit, idx) => {
                         const isAvailed = formData.servicesAvailed?.includes(benefit);
                         return (
                           <div key={idx} className={`flex items-center justify-between p-2 rounded ${isAvailed ? 'bg-green-900/20 border border-green-500/30' : 'bg-white/5'}`}>
                             <span className={`text-sm ${isAvailed ? 'text-green-400 line-through' : 'text-gray-300'}`}>{benefit}</span>
                             <button
                               onClick={() => {
                                 const currentAvailed = formData.servicesAvailed || [];
                                 const newAvailed = isAvailed 
                                   ? currentAvailed.filter(s => s !== benefit) 
                                   : [...currentAvailed, benefit];
                                 setFormData({ ...formData, servicesAvailed: newAvailed });
                               }}
                               className={`text-xs px-2 py-1 rounded font-bold transition-colors ${
                                 isAvailed 
                                   ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                   : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                               }`}
                             >
                               {isAvailed ? 'Undo' : 'Mark Done'}
                             </button>
                           </div>
                         );
                      })}
                      {(!formData.benefits || formData.benefits.trim() === '') && (
                        <p className="text-xs text-gray-500 italic">Add benefits above to track them.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                       const benefitsArray = formData.benefits
                        ? formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
                        : [];
                       // Also pass servicesAvailed to handleSave logic if not already handling state directly
                       handleSave(); 
                    }}
                    disabled={saveLoading}
                    className="flex-1 px-6 py-3 bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 bg-custom-black hover:bg-gray-800 border border-white/20 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
