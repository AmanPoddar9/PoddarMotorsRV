'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import API_URL from '../../config/api'
import { FaUser, FaEnvelope, FaPhone, FaLinkedin, FaBriefcase, FaCalendar, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa'
import { motion } from 'framer-motion'

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/careers/apply`, {
        withCredentials: true
      })
      if (response.data.success) {
        setApplications(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/careers/apply/${id}`,
        { status: newStatus },
        { withCredentials: true }
      )
      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`)
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'Reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'Shortlisted': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-custom-accent to-yellow-500 bg-clip-text text-transparent">
              Job Applications
            </h1>
            <p className="text-custom-platinum mt-1">Manage and track candidate applications</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-custom-jet border border-white/10 rounded-lg focus:border-custom-accent focus:outline-none text-white w-full sm:w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-custom-jet border border-white/10 rounded-lg focus:border-custom-accent focus:outline-none text-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={app._id} 
                className="bg-custom-jet/30 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {app.name}
                        {app.linkedinProfile && (
                          <a href={app.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            <FaLinkedin />
                          </a>
                        )}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-custom-platinum">
                        <span className="flex items-center gap-1"><FaEnvelope className="text-custom-accent" /> {app.email}</span>
                        <span className="flex items-center gap-1"><FaPhone className="text-custom-accent" /> {app.phone}</span>
                        <span className="flex items-center gap-1"><FaBriefcase className="text-custom-accent" /> {app.jobTitle}</span>
                        <span className="flex items-center gap-1"><FaCalendar className="text-custom-accent" /> {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer focus:outline-none ${getStatusColor(app.status)}`}
                      >
                        <option className="bg-custom-jet text-white" value="Pending">Pending</option>
                        <option className="bg-custom-jet text-white" value="Reviewed">Reviewed</option>
                        <option className="bg-custom-jet text-white" value="Shortlisted">Shortlisted</option>
                        <option className="bg-custom-jet text-white" value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 text-custom-platinum text-sm leading-relaxed border border-white/5">
                    <h3 className="text-xs font-bold text-custom-accent uppercase mb-2">Experience Summary</h3>
                    {app.experience}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-custom-jet/10 rounded-xl border border-white/5">
              <p className="text-custom-platinum">No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationsPage
