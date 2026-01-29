'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaLinkedin, FaPaperPlane, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'

const ApplicationModal = ({ isOpen, onClose, job }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedinProfile: '',
    experience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        jobId: job.id,
        jobTitle: job.title
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/careers/apply`, payload)
      
      if (response.data.success) {
        toast.success('Application submitted successfully!')
        onClose()
        setFormData({
          name: '',
          email: '',
          phone: '',
          linkedinProfile: '',
          experience: ''
        })
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error?.[0] || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-custom-jet border border-white/10 rounded-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-custom-accent/10">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Apply for {job?.title}</h2>
                    <p className="text-custom-platinum text-sm">Please fill in your details below. No CV upload required.</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-custom-platinum flex items-center gap-2">
                        <FaUser className="text-custom-accent" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-custom-platinum flex items-center gap-2">
                        <FaPhone className="text-custom-accent" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-custom-platinum flex items-center gap-2">
                      <FaEnvelope className="text-custom-accent" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-custom-platinum flex items-center gap-2">
                      <FaLinkedin className="text-custom-accent" /> LinkedIn / Portfolio URL <span className="text-xs text-white/40">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none transition-colors"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-custom-platinum">
                      Experience Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-custom-accent focus:outline-none transition-colors resize-none"
                      placeholder="Tell us briefly about your relevant experience, skills, and why you'd be a good fit..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-custom-accent hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-custom-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane /> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ApplicationModal
