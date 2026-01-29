'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaMoneyBillWave, FaWhatsapp, FaWpforms } from 'react-icons/fa'
import ApplicationModal from './ApplicationModal'

const JobCard = ({ job, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const whatsappNumber = '918709119090'
  const message = `Hi, I am interested in the ${job.title} position at Poddar Motors.`
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
        
        <div className="relative bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all duration-300 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-custom-accent transition-colors">
                {job.title}
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                {job.department}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6 flex-grow">
            <p className="text-custom-platinum text-sm leading-relaxed">
              {job.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-custom-platinum/80 pt-2">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-custom-accent" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-custom-accent" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-custom-accent" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-custom-accent" />
                <span>{job.salary}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 w-full bg-custom-accent hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-custom-accent/20 hover:shadow-custom-accent/30 group/btn"
            >
              <FaWpforms className="text-xl group-hover/btn:scale-110 transition-transform" />
              Apply Now
            </button>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-green-600/20 text-green-400 border border-green-500/30 font-bold py-3 rounded-xl transition-all hover:border-green-500/50"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </motion.div>

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        job={job} 
      />
    </>
  )
}

export default JobCard
