'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import JobCard from './JobCard'
import { FaUserTie, FaHandshake, FaChartLine, FaWhatsapp } from 'react-icons/fa'
import axios from 'axios'
import API_URL from '../config/api'

const CareersPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/careers/jobs`)
        if (response.data.success) {
          setJobs(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const benefits = [
    {
      icon: FaUserTie,
      title: 'Professional Growth',
      description: 'We believe in nurturing talent. Get regular training and opportunities to climb the career ladder.'
    },
    {
      icon: FaHandshake,
      title: 'Supportive Culture',
      description: 'Join a family, not just a company. We value teamwork, respect, and mutual support.'
    },
    {
      icon: FaChartLine,
      title: 'Performance Rewards',
      description: 'Your hard work never goes unnoticed. We offer competitive salaries and attractive performance incentives.'
    }
  ]

  return (
    <div className="bg-custom-black min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-custom-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                Join Our <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">Team</span>
              </h1>
              <p className="text-xl md:text-2xl text-custom-platinum max-w-3xl mx-auto mb-10 leading-relaxed">
                Build your career with Jharkhand's most trusted automobile dealership. 
                We are always looking for passionate people to join the Poddar Motors family.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Why Work With Us?</h2>
              <div className="w-20 h-1 bg-custom-accent mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-custom-jet/30 backdrop-blur-sm border border-white/5 p-8 rounded-2xl text-center hover:bg-custom-jet/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-custom-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black text-2xl">
                    <benefit.icon />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-custom-platinum">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
            >
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Open Positions</h2>
                <p className="text-custom-platinum">Find the role that fits you best</p>
              </div>
              <div className="bg-custom-jet/50 px-4 py-2 rounded-lg border border-white/10 text-sm text-custom-platinum">
                {jobs.length} Active Openings
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>

            {/* General Application Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
                Don't see a suitable role?
              </h3>
              <p className="text-custom-platinum mb-8 max-w-2xl mx-auto relative z-10">
                We are always open to meeting talented individuals. Send us your CV or just say hi on WhatsApp, and we'll keep you in mind for future opportunities.
              </p>
              <a
                href="https://wa.me/918709119090?text=Hi, I would like to inquire about career opportunities at Poddar Motors."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-custom-black px-8 py-4 rounded-full font-bold hover:bg-custom-accent transition-colors relative z-10"
              >
                <FaWhatsapp className="text-xl" />
                Chat with HR
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CareersPage
