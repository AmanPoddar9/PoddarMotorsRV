'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: 'Ranchi',
    type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    active: true
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Fetch ALL jobs (including inactive)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/careers/jobs/all`, {
        withCredentials: true
      })
      if (response.data.success) {
        setJobs(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/careers/jobs/${id}`, {
        withCredentials: true
      })
      if (response.data.success) {
        toast.success('Job deleted')
        fetchJobs()
      }
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingJob 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/careers/jobs/${editingJob._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/careers/jobs`
      
      const method = editingJob ? 'put' : 'post'
      
      const response = await axios[method](url, formData, { withCredentials: true })
      
      if (response.data.success) {
        toast.success(editingJob ? 'Job updated' : 'Job created')
        setIsModalOpen(false)
        setEditingJob(null)
        setFormData({
            title: '',
            department: '',
            location: 'Ranchi',
            type: 'Full-time',
            experience: '',
            salary: '',
            description: '',
            active: true
        })
        fetchJobs()
      }
    } catch (error) {
      console.error(error)
      toast.error('Operation failed')
    }
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        experience: job.experience,
        salary: job.salary,
        description: job.description,
        active: job.active
    })
    setIsModalOpen(true)
  }
  
  const openCreateModal = () => {
      setEditingJob(null)
      setFormData({
        title: '',
        department: '',
        location: 'Ranchi',
        type: 'Full-time',
        experience: '',
        salary: '',
        description: '',
        active: true
      })
      setIsModalOpen(true)
  }

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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-custom-accent to-yellow-500 bg-clip-text text-transparent">
              Manage Job Listings
            </h1>
            <p className="text-custom-platinum mt-1">Add or modify career opportunities</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-custom-accent hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-custom-accent/20"
          >
            <FaPlus /> Add New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-custom-jet/30 border ${job.active ? 'border-green-500/30' : 'border-red-500/30'} rounded-xl p-6 relative group hover:bg-custom-jet/50 transition-all`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(job)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(job._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40">
                  <FaTrash />
                </button>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{job.title}</h2>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${job.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                   {job.active ? <FaCheckCircle /> : <FaTimesCircle />} {job.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-custom-platinum mb-4">
                 <p className="flex items-center gap-2"><FaBriefcase className="text-custom-accent" /> {job.department}</p>
                 <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-custom-accent" /> {job.location}</p>
                 <p className="flex items-center gap-2"><FaMoneyBillWave className="text-custom-accent" /> {job.salary}</p>
              </div>
              
              <p className="text-custom-platinum/60 text-sm line-clamp-2">{job.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-custom-jet border border-white/10 rounded-2xl w-full max-w-2xl relative z-10 p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        placeholder="Job Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                     <input 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        placeholder="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        required
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                    />
                     <select 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                     >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                     </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        placeholder="Experience (e.g. 2-3 years)"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        required
                    />
                     <input 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none"
                        placeholder="Salary Range"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                        required
                    />
                </div>
                
                <textarea 
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none resize-none"
                    rows="5"
                    placeholder="Job Description..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                ></textarea>

                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="w-5 h-5 accent-custom-accent"
                    />
                    <label htmlFor="active" className="text-white">Active (Visible on public site)</label>
                </div>

                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all w-full">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-3 rounded-xl bg-custom-accent hover:bg-yellow-500 text-black font-bold transition-all w-full shadow-lg shadow-custom-accent/20">
                        {editingJob ? 'Update Job' : 'Create Job'}
                    </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobsPage
