'use client'
import React from 'react'
import { FaShieldAlt, FaCertificate } from 'react-icons/fa'
import { motion } from 'framer-motion'

const CertifiedBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
        <FaShieldAlt className="text-white text-sm" />
      </div>
      <div>
        <p className="text-emerald-400 text-sm font-bold flex items-center gap-1">
          <FaCertificate className="text-xs" />
          Certified Used Car
        </p>
        <p className="text-custom-platinum text-xs">242-Point Quality Check ✓</p>
      </div>
    </motion.div>
  )
}

export default CertifiedBadge
