'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import AdminNavbar from '../../components/AdminNavbar'
import API_URL from '../../config/api'
import { FiSearch, FiFilter, FiUser, FiPhone, FiMail, FiTag, FiMoreHorizontal, FiPlus, FiX } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  
  // Filters
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [primeFilter, setPrimeFilter] = useState('')

  // Add Customer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomerForm, setNewCustomerForm] = useState({
      name: '',
      mobile: '',
      email: '',
      source: 'Walk-in'
  })

  // ... (existing fetchCustomers)

  const handleAddCustomer = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`${API_URL}/api/customer`, newCustomerForm, { withCredentials: true })
          toast.success('Customer created successfully')
          setIsAddModalOpen(false)
          setNewCustomerForm({ name: '', mobile: '', email: '', source: 'Walk-in' })
          fetchCustomers(1) // Refresh list
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || 'Failed to create customer')
      }
  }

  // ... (existing useEffect, handlePageChange)

  return (
    <div className="min-h-screen bg-custom-black text-white">
      <AdminNavbar />
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">All Customers</h1>
                <p className="text-custom-platinum mt-1">Unified view of {pagination.total} customer profiles</p>
            </div>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-custom-accent text-custom-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
                <FiPlus /> Add Customer
            </button>
        </div>

        {/* ... (Existing Controls & Table) ... */}

        {/* Controls */}
        <div className="bg-custom-jet p-4 rounded-lg border border-white/10 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Name, Mobile, Email..." 
                    className="w-full bg-custom-black border border-white/10 text-white pl-10 pr-4 py-2 rounded focus:border-custom-accent focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
                <select 
                    className="bg-custom-black border border-white/10 text-white px-4 py-2 rounded focus:border-custom-accent focus:outline-none"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                >
                    <option value="">All Sources</option>
                    <option value="Import">Imported</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Workshop">Workshop</option>
                </select>

                <select 
                    className="bg-custom-black border border-white/10 text-white px-4 py-2 rounded focus:border-custom-accent focus:outline-none"
                    value={primeFilter}
                    onChange={(e) => setPrimeFilter(e.target.value)}
                >
                    <option value="all">All Membership</option>
                    <option value="active">Prime Members</option>
                    <option value="inactive">Non-Prime</option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-custom-jet rounded-lg border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-custom-platinum text-sm uppercase tracking-wider bg-white/5">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Tags</th>
                <th className="p-4">City</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {loading ? (
                    <tr><td colSpan="6" className="text-center p-8 text-custom-platinum">Loading...</td></tr>
                ) : customers.length === 0 ? (
                    <tr><td colSpan="6" className="text-center p-8 text-custom-platinum">No customers found.</td></tr>
                ) : (
                    customers.map((c) => (
                        <tr key={c._id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                                <Link href={`/admin/customers/${c._id}`} className="block">
                                    <div className="font-semibold text-white group-hover:text-custom-accent transition-colors">{c.name}</div>
                                    <div className="text-xs text-custom-platinum font-mono">{c.customId || 'No ID'}</div>
                                </Link>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center text-sm text-custom-platinum mb-1">
                                    <FiPhone className="mr-2 text-custom-accent" /> {c.mobile}
                                </div>
                                {c.email && (
                                    <div className="flex items-center text-sm text-custom-platinum">
                                        <FiMail className="mr-2 text-gray-400" /> {c.email}
                                    </div>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    c.source === 'Import' ? 'bg-purple-900 text-purple-200' : 
                                    c.source === 'Walk-in' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
                                }`}>
                                    {c.source}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                    {c.primeStatus?.isActive && (
                                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-900/50 text-yellow-500 border border-yellow-700">Prime</span>
                                    )}
                                    {c.tags && c.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300 border border-white/10">{tag}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-custom-platinum">{c.areaCity || '-'}</span>
                            </td>
                            <td className="p-4 text-right">
                                <Link href={`/admin/customers/${c._id}`} className="text-custom-accent hover:text-white font-medium text-sm">
                                    View 360 &rarr;
                                </Link>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-custom-platinum">
            <div>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded bg-custom-jet border border-white/10 disabled:opacity-50 hover:bg-white/10"
                >
                    Previous
                </button>
                <div className="px-2 py-1">Page {pagination.page} of {pagination.totalPages}</div>
                <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded bg-custom-jet border border-white/10 disabled:opacity-50 hover:bg-white/10"
                >
                    Next
                </button>
            </div>
        </div>

      </div>

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-custom-jet w-full max-w-md p-6 rounded-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add New Customer</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white"><FiX /></button>
                </div>
                <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                        <input 
                            required
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                            value={newCustomerForm.name}
                            onChange={e => setNewCustomerForm({...newCustomerForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Mobile Number *</label>
                         <input 
                            required
                            type="text"
                            maxLength="10"
                            pattern="[0-9]{10}"
                            placeholder="10 digit number"
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                            value={newCustomerForm.mobile}
                            onChange={e => setNewCustomerForm({...newCustomerForm, mobile: e.target.value.replace(/\D/g, '')})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email (Optional)</label>
                         <input 
                            type="email"
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                            value={newCustomerForm.email}
                            onChange={e => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-1">Source</label>
                            <select 
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                            value={newCustomerForm.source}
                            onChange={(e) => setNewCustomerForm({...newCustomerForm, source: e.target.value})}
                            >
                                {['Walk-in', 'TeleCRM', 'GoogleSheet', 'Website', 'Workshop', 'Facebook', 'Other'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-custom-accent hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <FiPlus /> Create Customer
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  )
}

export default CustomersPage
