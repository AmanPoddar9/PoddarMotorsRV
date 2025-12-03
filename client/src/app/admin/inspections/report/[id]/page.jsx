'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ViewReportPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchReport()
    }
  }, [id])

  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/reports/${id}`)
      const data = await res.json()
      if (res.ok) {
        setReport(data)
      } else {
        alert('Report not found')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Report...</div>
  if (!report) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Report Not Found</div>

  const categories = ['mechanical', 'electrical', 'exterior', 'interior', 'documentation']

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Inspection Report</h1>
            <p className="text-gray-400">Report ID: {report._id}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-500">{report.overallScore}/100</div>
            <div className="text-xl font-semibold text-white mt-1">Grade: {report.overallGrade}</div>
          </div>
        </div>

        {/* Car Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
            <div>
              <p className="text-gray-500 text-sm">Car</p>
              <p className="font-medium text-white text-lg">{report.bookingId?.brand} {report.bookingId?.model}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Registration</p>
              <p className="font-medium text-white text-lg">{report.bookingId?.registrationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Year</p>
              <p className="font-medium text-white text-lg">{report.bookingId?.year}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Fuel</p>
              <p className="font-medium text-white text-lg">{report.bookingId?.fuelType}</p>
            </div>
          </div>
        </div>

        {/* Inspector Summary */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Inspector Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Strengths</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {report.summary?.strengths?.map((item, i) => <li key={i}>{item}</li>) || <li>None listed</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-red-400 font-semibold mb-2">Weaknesses</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {report.summary?.weaknesses?.map((item, i) => <li key={i}>{item}</li>) || <li>None listed</li>}
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Recommendation</p>
            <p className="text-white font-bold text-lg">{report.summary?.recommendation}</p>
          </div>
        </div>

        {/* Detailed Checklist */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Detailed Checklist</h2>
          
          {categories.map(category => (
            <div key={category} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="bg-gray-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white capitalize">{category}</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report[category] && Object.entries(report[category]).map(([key, value]) => (
                  <div key={key} className="bg-gray-900/50 p-3 rounded border border-gray-700 flex justify-between items-center">
                    <span className="text-gray-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      value.status === 'Pass' ? 'bg-green-900 text-green-300' :
                      value.status === 'Fail' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {value.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.push('/admin/inspections')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Inspections
          </button>
        </div>
      </div>
    </div>
  )
}
