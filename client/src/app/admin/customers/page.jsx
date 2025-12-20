'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import AdminNavbar from '../../components/AdminNavbar'
import API_URL from '../../config/api'
import { FiSearch, FiFilter, FiUser, FiPhone, FiMail, FiTag, FiMoreHorizontal } from 'react-icons/fi'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  
  // Filters
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [primeFilter, setPrimeFilter] = useState('')

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 20,
        search,
        source: sourceFilter,
        primeStatus: primeFilter === 'all' ? '' : primeFilter
      }
      
      const response = await axios.get(`${API_URL}/api/customer/all`, { 
        params,
        withCredentials: true 
      })
      
      setCustomers(response.data.customers)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, sourceFilter, primeFilter])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCustomers(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-custom-black text-white">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">All Customers</h1>
                <p className="text-custom-platinum mt-1">Unified view of {pagination.total} customer profiles</p>
            </div>
            <button className="bg-custom-accent text-custom-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors">
                + Add Customer
            </button>
        </div>

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
                                <div className="font-semibold text-white">{c.name}</div>
                                <div className="text-xs text-custom-platinum font-mono">{c.customId || 'No ID'}</div>
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
    </div>
  )
}

export default CustomersPage
