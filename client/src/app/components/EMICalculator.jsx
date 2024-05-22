'use client'
import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import { AmountWithCommas } from '../utils'

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
        backgroundColor: ['rgba(222, 207, 0, 0.4)', 'rgba(255, 157, 0, 0.4)'],
        borderWidth: 1,
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
    maintainAspectRatio: false,
    aspectRatio: 1,
  }

  return (
    <section className={`${indiPrincipal ? 'py-0' : 'py-16'}`}>
      {/* Heading on the left */}
      <div
        className={`mx-auto max-w-7xl ${indiPrincipal ? 'py-0' : 'px-4 py-8 sm:px-6 lg:px-6'}`}
      >
        {indiPrincipal ? (
          <></>
        ) : (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-5 ">Finance</h2>
            <span className="mb-8 lg:mb-16 text-xl tracking-tight leading-tight text-gray-500 md:text-2xl">
              Everything you need to know financially before buying/selling a
              car.
            </span>
          </div>
        )}

        <div className="flex lg:flex-row flex-col justify-start">
          <div className="py-4">
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <div className="text-2xl font-bold mb-4">EMI Calculator</div>
              <div className="flex flex-col space-y-4">
                <div
                  className={`flex flex-col space-x-0 lg:space-x-4 lg:flex-row items-center justify-start lg:justify-between`}
                >
                  <label
                    htmlFor="principalAmount"
                    className="flex-1 mb-2 w-full"
                  >
                    Principal Amt:
                  </label>
                  <input
                    id="principalAmount"
                    type="number"
                    value={principalAmount}
                    step={10000}
                    onChange={(e) => {
                      setPrincipalAmount(e.target.value)
                    }}
                    className="border rounded px-2 py-1 w-full lg:w-1/2 mb-2"
                  />
                  <input
                    type="range"
                    min="100000"
                    max={indiPrincipal ? indiPrincipal : '5000000'}
                    step={10000}
                    value={principalAmount}
                    onChange={(e) => {
                      setPrincipalAmount(e.target.value)
                    }}
                    className="w-full lg:w-1/2 ml-5"
                  />
                </div>

                <div className="flex flex-col space-x-0 lg:space-x-4 lg:flex-row items-center justify-start lg:justify-between">
                  <label
                    htmlFor="rateOfInterest"
                    className="flex-1 mb-2 w-full"
                  >
                    Interest Rate:
                  </label>
                  <input
                    id="rateOfInterest"
                    type="number"
                    step={0.05}
                    value={rateOfInterest}
                    onChange={(e) => {
                      setRateOfInterest(e.target.value)
                    }}
                    className="border rounded px-2 py-1 w-full lg:w-1/2 mb-2"
                  />
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.05"
                    value={rateOfInterest}
                    onChange={(e) => {
                      setRateOfInterest(e.target.value)
                    }}
                    className="w-full lg:w-1/2 ml-5"
                  />
                </div>
                <div className="flex flex-col space-x-0 lg:space-x-4 lg:flex-row items-center justify-start lg:justify-between">
                  <label htmlFor="tenure" className="flex-1 mb-2 w-full">
                    Tenure (in years):
                  </label>
                  <input
                    id="tenure"
                    type="number"
                    value={tenure}
                    step={1}
                    onChange={(e) => {
                      setTenure(e.target.value)
                    }}
                    className="border rounded px-2 py-1 w-full lg:w-1/2 mb-2"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={tenure}
                    onChange={(e) => {
                      setTenure(e.target.value)
                    }}
                    className="w-full lg:w-1/2 ml-5"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="text-xl font-bold mb-2">EMI Details:</div>
              <div className="flex justify-between mb-2">
                <div>EMI:</div>
                <div className="font-bold" style={{ fontSize: '20px' }}>
                  ₹{AmountWithCommas(emi)}/month
                </div>
              </div>
              {/* Add principal amount also */}
              <div className="flex justify-between mb-2">
                <div>Principal Amt:</div>
                <div>₹{AmountWithCommas(principalAmount)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div>Total Interest:</div>
                <div>₹{AmountWithCommas(totalInterest)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total Payment:</div>
                <div>₹{AmountWithCommas(totalPayment)}</div>
              </div>
            </div>
          </div>
          {indiPrincipal ? (
            <></>
          ) : (
            <div className="py-4 lg:mx-10">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="text-xl font-bold mb-2">
                  Interest vs Principal:
                </div>
                <div style={{ height: '27.8rem' }}>
                  <Doughnut
                    data={doughnutChartData}
                    options={doughnutOptions}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EMICalculator
