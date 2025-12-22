import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaSearch, FaEye, FaPhone, FaWhatsapp, FaSort, FaEdit, FaTrash } from 'react-icons/fa'
import CustomerDetailModal from './CustomerDetailModal'
import EditPolicyModal from './EditPolicyModal'

export default function PolicyList({ initialFilter, initialBucket }) {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  /* eslint-disable no-unused-vars */
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState(initialFilter || 'all') // all, today, week, month, expired, my_followups
  const [bucket, setBucket] = useState(initialBucket || null) // upcoming_month, 15_days, 7_days, overdue
  const [search, setSearch] = useState('')
  
  const [limit, setLimit] = useState(10) // Limit Rows
  
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(null) // New Selection
  const [agents, setAgents] = useState([])

  // ... (Keep existing effects)
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

  const handleDelete = async (policyId) => {
      if (!window.confirm("Are you sure you want to delete this policy? This action cannot be undone.")) return;

      try {
          await axios.delete(`${API_URL}/api/insurance/policies/${policyId}`, { withCredentials: true });
          alert("Policy deleted successfully");
          fetchPolicies(); // Refresh list
      } catch (error) {
          console.error("Error deleting policy:", error);
          alert("Failed to delete policy");
      }
  };

  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const params = { page, limit, filter, search };
      if (bucket) params.bucket = bucket;

      const res = await axios.get(`${API_URL}/api/insurance/policies`, {
        params,
        withCredentials: true
      })
      setPolicies(res.data.policies)
      setTotalPages(res.data.totalPages)
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
  }, [page, filter, bucket, search, limit])

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
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Policies' },
            { id: 'today', label: 'Expiring Today', isBucket: true },
            { id: 'tomorrow', label: 'Expiring Tomorrow', isBucket: true },
            { id: 'followups_done_today', label: 'Follow-ups Done Today' },
            { id: 'needs_fix', label: 'Needs Fix' },
            { id: 'renewed_month', label: 'Renewed This Month' },
            { id: 'lost_month', label: 'Lost This Month' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { 
                  if (f.isBucket) { 
                      setFilter('all'); 
                      setBucket(f.id); 
                  } else { 
                      setFilter(f.id); 
                      setBucket(null); 
                  }
                  setPage(1); 
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition ${
                (filter === f.id && !bucket) || (bucket === f.id) 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Follow-up</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </td>
              </tr>
            ) : policies.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-12 text-gray-400">
                  No policies found matching filter.
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white max-w-[150px] truncate" title={policy.customer?.name}>{policy.customer?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-400">{policy.customer?.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{policy.vehicle?.regNumber}</div>
                    <div className="text-xs text-gray-400 max-w-[120px] truncate">{policy.vehicle?.model}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    <div title={policy.policyNumber} className="truncate max-w-[120px]">{policy.policyNumber}</div>
                    <div className="text-xs text-gray-500">{policy.insurer}</div>
                  </td>
                  <td className="px-6 py-4">
                    {policy.policyEndDate ? (
                        <>
                            <div className={`font-medium ${new Date(policy.policyEndDate) < new Date() && policy.renewalStatus !== 'Renewed' ? 'text-red-400' : 'text-white'}`}>
                            {new Date(policy.policyEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                            <div className="text-xs text-gray-500">{new Date(policy.policyEndDate).getFullYear()}</div>
                        </>
                    ) : (
                        <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">Invalid Date</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                         {policy.renewalStage || 'New'}
                     </span>
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
                        className="bg-gray-700 text-white text-xs rounded p-1 border-none focus:ring-1 focus:ring-blue-500 w-24"
                    >
                        <option value="">Unassigned</option>
                        {agents.map(agent => (
                            <option key={agent._id} value={agent._id}>{agent.name || agent.email}</option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold w-fit ${getStatusColor(policy.renewalStatus || 'Pending', policy.policyEndDate)}`}>
                            {policy.renewalStatus || 'Pending'}
                        </span>
                        {policy.reminderStatus && policy.reminderStatus !== 'None' && (
                            <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded w-fit border border-blue-500/20">
                                {policy.reminderStatus} Reminder
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                        {/* New Edit Button */}
                        <button 
                         onClick={() => setEditingPolicy(policy)}
                         className="p-2 bg-gray-700 hover:text-white rounded-lg text-yellow-500 transition"
                         title="Edit Policy"
                        >
                            <FaEdit />
                        </button>
                        <button 
                        onClick={() => handleOpenDetail(policy.customer._id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-blue-400 transition"
                        title="View Details"
                        >
                        <FaEye />
                        </button>
                        <button 
                            onClick={() => {
                                // Smart Action: Open Modal with WhatsApp type
                                setIsDetailModalOpen(true);
                                setTimeout(() => {
                                    // Hacky way to trigger modal internal state if possible, 
                                    // BUT better way: pass a prop or use a ref.
                                    // Actually, PolicyList has 'handleOpenDetail'.
                                    // Let's use the unified ActionModal directly if possible?
                                    // PolicyList doesn't import ActionModal directly, it uses CustomerDetailModal.
                                    // Wait, it DOES import ActionModal? No, it imports CustomerDetailModal and EditPolicyModal.
                                    // LET'S OPEN CUSTOMER DETAIL MODAL FOR NOW, OR BETTER:
                                    // We should open CustomerDetail and auto-trigger the action modal there.
                                    // Or Refactor PolicyList to have its own ActionModal.
                                    // To keep it simple: Open Customer Detail. User can click "Log Action".
                                    // OR: Pass a query param/state to CustomerDetailModal to auto-open action.
                                    // Let's just open CustomerDetailModal for now to avoid refactoring hell.
                                    handleOpenDetail(policy.customer._id);
                                }, 100);
                            }}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition"
                            title="Open Smart WhatsApp Action"
                        >
                            <FaWhatsapp />
                        </button>
                        <button 
                            onClick={() => handleDelete(policy._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500 transition"
                            title="Delete Policy"
                        >
                            <FaTrash />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Limit Control */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
              Showing <span className="text-white font-bold">{policies.length}</span> of <span className="text-white font-bold">{totalPages * limit}</span> entries
          </div>

          <div className="flex items-center gap-4">
               {/* Limit Selector */}
               <div className="flex items-center gap-2">
                   <span className="text-sm text-gray-400">Rows:</span>
                   <select 
                       value={limit} 
                       onChange={(e) => {
                           setLimit(Number(e.target.value));
                           setPage(1); // Reset to page 1 on limit change
                       }}
                       className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-blue-500"
                   >
                       <option value={10}>10</option>
                       <option value={20}>20</option>
                       <option value={50}>50</option>
                       <option value={100}>100</option>
                   </select>
               </div>

               {/* Pagination Buttons */}
               <div className="flex gap-1">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 text-white text-sm transition"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1 text-gray-400 text-sm">
                        Page <span className="text-white font-bold">{page}</span> of {totalPages}
                    </span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 text-white text-sm transition"
                    >
                        Next
                    </button>
               </div>
          </div>
      </div>

      {isDetailModalOpen && (
        <CustomerDetailModal 
          isOpen={isDetailModalOpen}
          customerId={selectedCustomer}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      <EditPolicyModal 
        isOpen={!!editingPolicy}
        policy={editingPolicy}
        onClose={() => setEditingPolicy(null)}
        onSuccess={() => fetchPolicies()}
      />
    </div>
  )
}
