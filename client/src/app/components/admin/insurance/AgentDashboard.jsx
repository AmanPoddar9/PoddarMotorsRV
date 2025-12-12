'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import ActionModal from './ActionModal'
import { FaWhatsapp, FaPhone, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export default function AgentDashboard() {
  // Buckets
  const [buckets, setBuckets] = useState({
    upcoming: { title: 'Focus: Next Month', count: 0, items: [] },
    midMonth: { title: 'Follow-up (15 Days)', count: 0, items: [] },
    critical: { title: 'Critical (7 Days)', count: 0, items: [] },
    overdue: { title: 'Lapse Warning', count: 0, items: [] }
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuckets()
  }, [])

  const fetchBuckets = async () => {
    setLoading(true)
    try {
        const [upRes, midRes, critRes, overRes] = await Promise.all([
            axios.get(`${API_URL}/api/insurance/policies`, { params: { bucket: 'upcoming_month', limit: 5 }, withCredentials: true }),
            axios.get(`${API_URL}/api/insurance/policies`, { params: { bucket: '15_days', limit: 5 }, withCredentials: true }),
            axios.get(`${API_URL}/api/insurance/policies`, { params: { bucket: '7_days', limit: 5 }, withCredentials: true }),
            axios.get(`${API_URL}/api/insurance/policies`, { params: { bucket: 'overdue', limit: 5 }, withCredentials: true })
        ])

        setBuckets({
            upcoming: { title: 'Focus: Next Month', count: upRes.data.totalPolicies, items: upRes.data.policies },
            midMonth: { title: 'Follow-up (15 Days)', count: midRes.data.totalPolicies, items: midRes.data.policies },
            critical: { title: 'Critical (7 Days)', count: critRes.data.totalPolicies, items: critRes.data.policies },
            overdue: { title: 'Lapse Warning', count: overRes.data.totalPolicies, items: overRes.data.policies }
        })
    } catch (error) {
        console.error("Error loading dashboard", error)
    } finally {
        setLoading(false)
    }
  }

  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [actionType, setActionType] = useState('')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  const handleAction = (policyId, action) => {
      setSelectedPolicy(policyId)
      setActionType(action)
      setIsActionModalOpen(true)
  }

  const BucketCard = ({ title, count, items, color, actionLabel }) => (
    <div className={`bg-gray-800 rounded-xl border-l-4 ${color} p-4 flex-1 min-w-[300px]`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-200">{title}</h3>
            <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">{count} Pending</span>
        </div>
        
        <div className="space-y-3">
            {items.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No tasks in this bucket.</p>
            ) : (
                items.map(policy => (
                    <div key={policy._id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-sm text-white">{policy.customer?.name || 'Unknown'}</h4>
                                <p className="text-xs text-gray-400">{policy.vehicle?.regNumber}</p>
                                <p className="text-xs text-gray-400 mt-1">Exp: {new Date(policy.policyEndDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleAction(policy._id, 'whatsapp')} className="text-green-500 hover:text-green-400">
                                    <FaWhatsapp size={18} />
                                </button>
                                <button onClick={() => handleAction(policy._id, 'call')} className="text-blue-500 hover:text-blue-400">
                                    <FaPhone size={16} />
                                </button>
                            </div>
                        </div>
                         <div className="mt-2 text-xs text-gray-500">
                                Status: <span className="text-yellow-500">{policy.renewalStatus}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
        <button className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white border-t border-gray-700">View All</button>
    </div>
  )
 
  if (loading) return <div className="p-8 text-center text-gray-400">Loading your workflow...</div>

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">My Agent Workflow</h2>
        
        {/* Kanban Row */}
        <div className="flex flex-wrap gap-4 overflow-x-auto pb-4">
            <BucketCard 
                title={buckets.upcoming.title} 
                count={buckets.upcoming.count} 
                items={buckets.upcoming.items} 
                color="border-blue-500" 
            />
             <BucketCard 
                title={buckets.midMonth.title} 
                count={buckets.midMonth.count} 
                items={buckets.midMonth.items} 
                color="border-yellow-500" 
            />
             <BucketCard 
                title={buckets.critical.title} 
                count={buckets.critical.count} 
                items={buckets.critical.items} 
                color="border-orange-500" 
            />
             <BucketCard 
                title={buckets.overdue.title} 
                count={buckets.overdue.count} 
                items={buckets.overdue.items} 
                color="border-red-500" 
            />
        </div>

        <ActionModal 
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            policyId={selectedPolicy}
            actionType={actionType}
            onSuccess={() => {
                fetchBuckets() // Refresh data
            }}
        />
    </div>
  )
}
