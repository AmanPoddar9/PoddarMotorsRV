'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCrown, FaSearch, FaTimes } from 'react-icons/fa'
import API_URL from '../../config/api'

export default function PrimeMembershipsPage() {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [formData, setFormData] = useState({
    isActive: false,
    tier: 'Gold',
    expiryDate: '',
    benefits: ''
  })
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchQuery, filterStatus])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/customer/all`, { withCredentials: true })
      setCustomers(res.data.customers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by Prime status
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
      benefits
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
          benefits: benefitsArray
        },
        { withCredentials: true }
      )

      setModalOpen(false)
      fetchCustomers() // Refresh
    } catch (error) {
      console.error('Error updating Prime status:', error)
      alert('Failed to update Prime status')
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-custom-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FaCrown className="text-custom-accent" />
            Prime Memberships
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-custom-jet rounded-xl p-6 mb-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-platinum" />
              <input
                type="text"
                placeholder="Search by name, mobile, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-custom-accent"
              >
                <option value="all">All Customers</option>
                <option value="active">Active Prime</option>
                <option value="inactive">Inactive Prime</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-custom-platinum">Loading...</div>
        ) : (
          <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-custom-black border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Prime Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Expiry</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-custom-platinum">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-b border-white/5 hover:bg-custom-black/50">
                      <td className="px-6 py-4">{customer.name}</td>
                      <td className="px-6 py-4 text-custom-platinum">{customer.mobile}</td>
                      <td className="px-6 py-4 text-custom-platinum text-sm">{customer.email}</td>
                      <td className="px-6 py-4">
                        {customer.primeStatus?.isActive ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-custom-accent/20 text-custom-accent rounded-full text-sm font-medium">
                            <FaCrown className="text-xs" />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-sm">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {customer.primeStatus?.tier || '-'}
                      </td>
                      <td className="px-6 py-4 text-custom-platinum text-sm">
                        {customer.primeStatus?.expiryDate 
                          ? new Date(customer.primeStatus.expiryDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="px-4 py-2 bg-custom-accent hover:bg-yellow-400 text-custom-black font-medium rounded-lg transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
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

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium mb-2">Benefits (comma-separated)</label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="E.g., Free Oil Change, 10% Discount on Parts, Priority Service"
                  rows={3}
                  className="w-full px-4 py-3 bg-custom-black border border-white/20 rounded-lg text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
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
  )
}
