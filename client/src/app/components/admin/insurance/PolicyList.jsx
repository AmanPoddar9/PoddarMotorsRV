'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaSearch, FaEye, FaPhone, FaWhatsapp, FaSort } from 'react-icons/fa'
import CustomerDetailModal from './CustomerDetailModal'

export default function PolicyList({ initialFilter, initialBucket }) {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  /* eslint-disable no-unused-vars */
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState(initialFilter || 'all') // all, today, week, month, expired, my_followups
  const [bucket, setBucket] = useState(initialBucket || null) // upcoming_month, 15_days, 7_days, overdue
  const [search, setSearch] = useState('')
  
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [agents, setAgents] = useState([])

  // Update state when props change (re-sync)
  useEffect(() => {
     if(initialFilter) setFilter(initialFilter)
     if(initialBucket) setBucket(initialBucket)
  }, [initialFilter, initialBucket])

  useEffect(() => {
      fetchAgents()
  }, [])

  const fetchAgents = async () => {
      try {
          const res = await axios.get(`${API_URL}/api/user/agents`, { withCredentials: true })
          setAgents(res.data)
      } catch (error) {
          console.error("Error fetching agents", error)
      }
  }

  const handleAssignAgent = async (policyId, agentId) => {
      try {
          await axios.patch(`${API_URL}/api/insurance/policies/${policyId}`, { assignedAgent: agentId }, { withCredentials: true })
          // Optionally refresh or optimistic update
          fetchPolicies()
      } catch (error) {
          alert('Failed to assign agent')
      }
  }

  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/insurance/policies`, {
        params: { page, limit: 10, filter, bucket, search },
        withCredentials: true
      })
      setPolicies(res.data.policies)
      setTotalPages(res.data.pages)
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPolicies()
    }, 500) // Debounce search

    return () => clearTimeout(delayDebounceFn)
  }, [page, filter, bucket, search])

  const handleOpenDetail = (customerId) => {
    setSelectedCustomer(customerId)
    setIsDetailModalOpen(true)
  }

  const getStatusColor = (status, date) => {
    // If active but date passed, show Red
    if (status === 'Active' && new Date(date) < new Date()) return 'bg-red-500/20 text-red-400'
    if (status === 'Expired') return 'bg-red-500/20 text-red-400'
    if (status === 'Renewed') return 'bg-green-500/20 text-green-400'
    return 'bg-blue-500/20 text-blue-400'
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Filters & Search */}
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Policies' },
            { id: 'my_followups', label: 'My Follow-ups' },
            { id: 'today', label: 'Expiring Today' },
            { id: 'week', label: 'Expiring Week' },
            { id: 'expired', label: 'Overdue / Expired' },
            { id: 'renewed', label: 'Renewed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setBucket(null); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition ${
                filter === f.id && !bucket ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="relative min-w-[250px]">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, mobile, reg no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Customer</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Policy No</th>
              <th className="px-6 py-4"><div className="flex items-center gap-1">Expiry <FaSort className="text-xs"/></div></th>
              <th className="px-6 py-4">Follow-up</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </td>
              </tr>
            ) : policies.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-400">
                  No policies found matching filter.
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{policy.customer?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-400">{policy.customer?.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{policy.vehicle?.regNumber}</div>
                    <div className="text-xs text-gray-400">{policy.vehicle?.model}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    {policy.policyNumber}
                    <div className="text-xs text-gray-500">{policy.insurer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${new Date(policy.policyEndDate) < new Date() ? 'text-red-400' : 'text-white'}`}>
                      {new Date(policy.policyEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(policy.policyEndDate).getFullYear()}</div>
                  </td>
                  <td className="px-6 py-4">
                     {policy.nextFollowUpDate ? (
                        <span className={`text-xs px-2 py-1 rounded ${new Date(policy.nextFollowUpDate) <= new Date() ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-400'}`}>
                            {new Date(policy.nextFollowUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                     ) : <span className="text-gray-600 text-xs">-</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <select 
                        value={policy.assignedAgent?._id || ''} 
                        onChange={(e) => handleAssignAgent(policy._id, e.target.value)}
                        className="bg-gray-700 text-white text-xs rounded p-1 border-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Unassigned</option>
                        {agents.map(agent => (
                            <option key={agent._id} value={agent._id}>{agent.name || agent.email}</option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusColor(policy.renewalStatus || policy.status, policy.policyEndDate)}`}>
                      {policy.renewalStatus || policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button 
                        onClick={() => handleOpenDetail(policy.customer._id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-blue-400 transition"
                        title="View Details"
                        >
                        <FaEye />
                        </button>
                        <a 
                            href={`https://wa.me/91${policy.customer?.mobile}?text=Hi ${policy.customer?.name}, your insurance for ${policy.vehicle?.regNumber} is expiring on ${new Date(policy.policyEndDate).toLocaleDateString()}.`}
                            target="_blank"
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition"
                            title="WhatsApp"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 text-white"
          >
            Prev
          </button>
          <span className="text-gray-400 py-1">Page {page} of {totalPages}</span>
          <button 
             disabled={page === totalPages}
             onClick={() => setPage(page + 1)}
             className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 text-white"
          >
            Next
          </button>
        </div>
      )}

      {isDetailModalOpen && (
        <CustomerDetailModal 
          isOpen={isDetailModalOpen}
          customerId={selectedCustomer}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  )
}
