'use client'

import { useState, useEffect } from 'react'
import ImageGallery from '../../components/dealer/ImageGallery'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function PublicReportPage({ params }) {
  const { id } = params
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/inspections/reports/public/${id}`)
        if (!res.ok) throw new Error('Report not found')
        const data = await res.json()
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Report...</div>
  if (error) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">{error}</div>
  if (!report) return null

  const car = report.bookingId

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Poddar Motors" className="h-8 w-auto" />
            <span className="font-bold text-lg hidden sm:block">Certified Inspection</span>
          </div>
          <a 
            href="tel:+919999999999" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
          >
            Call to Buy
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Car Title & Score */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {car.brand} {car.model} {car.variant}
            </h1>
            <div className="flex gap-3 text-gray-400 text-sm">
              <span>{car.year}</span>
              <span>•</span>
              <span>{car.fuelType}</span>
              <span>•</span>
              <span>{car.transmission}</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              report.overallGrade === 'Excellent' ? 'text-green-400' :
              report.overallGrade === 'Good' ? 'text-blue-400' :
              report.overallGrade === 'Fair' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {report.overallScore}/100
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{report.overallGrade}</div>
          </div>
        </div>

        {/* Image Gallery */}
        {report.photos && <ImageGallery photos={report.photos} />}

        {/* Inspector Summary */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Inspector's Verdict</h2>
          <div className="space-y-4">
            <div>
              <span className="text-gray-400 text-sm block mb-1">Recommendation</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.summary.recommendation === 'Ready for Auction' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                report.summary.recommendation === 'Not Recommended' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
              }`}>
                {report.summary.recommendation}
              </span>
            </div>
            {report.summary.strengths.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm block mb-1">Strengths</span>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {report.summary.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {report.summary.majorIssues.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm block mb-1">Major Issues</span>
                <ul className="list-disc list-inside text-red-400 space-y-1">
                  {report.summary.majorIssues.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Checklist (Simplified for Public) */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Inspection Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['mechanical', 'electrical', 'exterior', 'interior', 'tyres'].map(category => {
              // Calculate category score if available, else show N/A
              // For simplicity in this public view, we might just show "Pass/Fail" summary or just list the category
              // Let's just list categories with a checkmark if they exist in the report
              if (!report[category]) return null
              
              // Count pass/fail items
              const items = Object.values(report[category])
              const passCount = items.filter(i => i.status === 'Pass').length
              const totalCount = items.length
              
              return (
                <div key={category} className="bg-gray-750 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                  <span className="capitalize text-gray-300">{category}</span>
                  <span className="text-sm font-mono text-gray-400">{passCount}/{totalCount} Passed</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-8 text-gray-500 text-sm">
          <p>Inspection Report generated by Poddar Motors RV</p>
          <p className="mt-2">Interested in this car? Call us for more details.</p>
        </div>
      </div>
    </div>
  )
}
