'use client'
import React, { useState } from 'react'
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { AmountWithCommas } from '../utils'

const PriceBreakdown = ({ basePrice }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Calculate estimated additional costs
  const estimatedInsurance = Math.round(basePrice * 0.03) // 3% of base price
  const estimatedRTO = basePrice < 500000 ? 8000 : 12000 // ₹8k for cheaper cars, ₹12k for expensive
  
  const onRoadPrice = basePrice + estimatedInsurance + estimatedRTO

  return (
    <div className="bg-custom-jet/30 border border-white/10 rounded-2xl p-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-custom-accent" />
          <span className="text-white font-semibold">Price Breakdown</span>
        </div>
        {isExpanded ? (
          <FaChevronUp className="text-custom-platinum" />
        ) : (
          <FaChevronDown className="text-custom-platinum" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              {/* Base Price */}
              <div className="flex justify-between items-center">
                <span className="text-custom-platinum">Base Price</span>
                <span className="text-white font-semibold">₹{AmountWithCommas(basePrice)}</span>
              </div>

              {/* Insurance */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-custom-platinum">Insurance</span>
                  <span className="text-xs text-gray-500">(Est.)</span>
                </div>
                <span className="text-white font-semibold">₹{AmountWithCommas(estimatedInsurance)}</span>
              </div>

              {/* RTO */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-custom-platinum">RTO Charges</span>
                  <span className="text-xs text-gray-500">(Est.)</span>
                </div>
                <span className="text-white font-semibold">₹{AmountWithCommas(estimatedRTO)}</span>
              </div>

              {/* Total Divider */}
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-custom-accent font-bold">Estimated On-Road Price</span>
                  <span className="text-custom-accent font-bold text-lg">₹{AmountWithCommas(onRoadPrice)}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                * Insurance and RTO charges are estimates and may vary based on location, coverage, and other factors. 
                Contact us for exact pricing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PriceBreakdown
