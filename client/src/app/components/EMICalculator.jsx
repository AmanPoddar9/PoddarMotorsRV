'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { AmountWithCommas } from '../utils'
import { FaRupeeSign, FaPercent, FaCalendarAlt } from 'react-icons/fa'

ChartJS.register(ArcElement, Tooltip, Legend)

const EMICalculator = ({ indiPrincipal }) => {
  const [principalAmount, setPrincipalAmount] = useState(500000)
  const [rateOfInterest, setRateOfInterest] = useState(10)
  const [tenure, setTenure] = useState(3)
  const [emi, setEmi] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)

  const calculateEmi = () => {
    const principal = parseFloat(principalAmount)
    const rate = parseFloat(rateOfInterest) / 12 / 100
    const months = parseFloat(tenure) * 12

    if (principal && rate && months) {
      const emiNumerator = principal * rate * Math.pow(1 + rate, months)
      const emiDenominator = Math.pow(1 + rate, months) - 1
      const emi = emiNumerator / emiDenominator
      setEmi(Math.round(emi))

      const totalPayment = emi * months
      setTotalPayment(Math.round(totalPayment))

      const totalInterest = totalPayment - principal
      setTotalInterest(Math.round(totalInterest))
    } else {
      setEmi(0)
      setTotalPayment(0)
      setTotalInterest(0)
    }
  }

  const doughnutChartData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        label: 'Amount in rupees',
        data: [principalAmount, totalInterest],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',  // Custom accent
          'rgba(59, 130, 246, 0.8)'    // Blue
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2,
      },
    ],
  }

  useEffect(() => {
    if (indiPrincipal) {
      setPrincipalAmount(indiPrincipal)
    }
  }, [])

  useEffect(() => {
    calculateEmi()
  }, [principalAmount, rateOfInterest, tenure])

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 14,
            family: 'Inter, sans-serif'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f59e0b',
        bodyColor: '#e2e8f0',
        borderColor: '#f59e0b',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.label + ': ₹' + AmountWithCommas(context.parsed)
          }
        }
      }
    }
  }

  return (
    <section className={`${indiPrincipal ? 'py-0' : 'py-0'}`}>
      <div className={`mx-auto max-w-7xl ${indiPrincipal ? 'py-0' : 'px-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-custom-jet/80 to-custom-jet/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-10 h-10 bg-custom-accent/20 rounded-full flex items-center justify-center">
                  <FaRupeeSign className="text-custom-accent" />
                </span>
                Loan Details
              </h3>

              <div className="space-y-6">
                {/* Principal Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-custom-platinum font-medium flex items-center gap-2">
                      <FaRupeeSign className="text-custom-accent text-sm" />
                      Loan Amount
                    </label>
                    <div className="text-2xl font-bold text-white">
                      ₹{AmountWithCommas(principalAmount)}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="100000"
                      max={indiPrincipal ? indiPrincipal : '5000000'}
                      step={10000}
                      value={principalAmount}
                      onChange={(e) => setPrincipalAmount(e.target.value)}
                      className="w-full h-2 bg-custom-black/50 rounded-lg appearance-none cursor-pointer accent-custom-accent 
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-custom-accent 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-custom-accent/50
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:hover:scale-125"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-custom-platinum">
                    <span>₹1L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-custom-platinum font-medium flex items-center gap-2">
                      <FaPercent className="text-custom-accent text-sm" />
                      Interest Rate
                    </label>
                    <div className="text-2xl font-bold text-white">
                      {rateOfInterest}% p.a.
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={rateOfInterest}
                      onChange={(e) => setRateOfInterest(e.target.value)}
                      className="w-full h-2 bg-custom-black/50 rounded-lg appearance-none cursor-pointer accent-custom-accent
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-custom-accent 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-custom-accent/50
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:hover:scale-125"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-custom-platinum">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-custom-platinum font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-custom-accent text-sm" />
                      Loan Tenure
                    </label>
                    <div className="text-2xl font-bold text-white">
                      {tenure} {tenure === 1 ? 'Year' : 'Years'}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="w-full h-2 bg-custom-black/50 rounded-lg appearance-none cursor-pointer accent-custom-accent
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-custom-accent 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-custom-accent/50
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:hover:scale-125"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-custom-platinum">
                    <span>1 Year</span>
                    <span>10 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results & Chart */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* EMI Result Card */}
            <div className="bg-gradient-to-br from-custom-accent to-yellow-400 p-8 rounded-3xl shadow-2xl text-custom-black">
              <div className="text-sm font-semibold mb-2 uppercase tracking-wide">Monthly EMI</div>
              <div className="text-5xl font-bold mb-2">₹{AmountWithCommas(emi)}</div>
              <div className="text-sm opacity-80">per month for {tenure * 12} months</div>
            </div>

            {/* Breakdown */}
            <div className="bg-gradient-to-br from-custom-jet/80 to-custom-jet/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-custom-platinum">Principal Amount</span>
                  <span className="text-white font-bold text-lg">₹{AmountWithCommas(principalAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-custom-platinum">Total Interest</span>
                  <span className="text-blue-400 font-bold text-lg">₹{AmountWithCommas(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white font-semibold">Total Payment</span>
                  <span className="text-custom-accent font-bold text-2xl">₹{AmountWithCommas(totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Chart - Only show if not individual principal */}
            {!indiPrincipal && (
              <div className="bg-gradient-to-br from-custom-jet/80 to-custom-jet/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Principal vs Interest</h3>
                <div className="aspect-square max-w-sm mx-auto">
                  <Doughnut data={doughnutChartData} options={doughnutOptions} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EMICalculator
