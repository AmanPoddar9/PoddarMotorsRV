'use client'

import { useState, useEffect } from 'react'


import DashboardStats from '../../components/admin/insurance/DashboardStats'
import PolicyList from '../../components/admin/insurance/PolicyList'
import AddPolicyModal from '../../components/admin/insurance/AddPolicyModal'
import AgentDashboard from '../../components/admin/insurance/AgentDashboard'
import ImportModal from '../../components/admin/insurance/ImportModal'
import { FaPlus, FaSearch, FaFileImport } from 'react-icons/fa'

export default function InsurancePage() {
  const [stats, setStats] = useState({
    expiringToday: 0,
    expiringWeek: 0,
    expiringMonth: 0,
    expired: 0
  })
  const [activeTab, setActiveTab] = useState('dashboard') 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/insurance/stats`, { withCredentials: true })
      setStats(res.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Insurance CRM</h1>
          <p className="text-gray-400 mt-1">Manage renewals, follow-ups, and policies</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition text-white border border-gray-600"
            >
              <FaFileImport /> Import CSV
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              <FaPlus /> Add Policy
            </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Main Content Area */}
      <div className="mt-8">
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-2 font-medium transition ${activeTab === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            All Policies
          </button>
          <button 
            onClick={() => setActiveTab('workflow')}
            className={`pb-3 px-2 font-medium transition ${activeTab === 'workflow' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Agent Workflow
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <PolicyList key="list" />
        )}
        
        {activeTab === 'workflow' && (
          <AgentDashboard key="workflow" />
        )}
      </div>

      {isAddModalOpen && (
        <AddPolicyModal 
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false)
            fetchStats() 
            window.location.reload() 
          }} 
        />
      )}

      {isImportModalOpen && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => {
            setIsImportModalOpen(false) // Just close, user might reload if sucessful via modal logic
            fetchStats()
          }}
        />
      )}
    </div>
  )
}
