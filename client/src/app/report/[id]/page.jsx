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
              {car?.brand || report.vehicleInfo?.makeModelVariant || 'Vehicle'}
            </h1>
            <div className="flex gap-3 text-gray-400 text-sm">
              <span>{car?.year || report.vehicleInfo?.manufacturingYear || 'N/A'}</span>
              <span>•</span>
              <span>{car?.fuelType || report.vehicleInfo?.fuelType || 'N/A'}</span>
              <span>•</span>
              <span>{car?.transmission || report.vehicleInfo?.transmission || 'N/A'}</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              report.overallGrade === 'A' ? 'text-green-400' :
              report.overallGrade === 'B' ? 'text-blue-400' :
              report.overallGrade === 'C' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {report.overallScore || 0}/100
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Grade {report.overallGrade || 'N/A'}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {report.photos && <ImageGallery photos={report.photos} />}

        {/* Inspector Summary */}
        {report.finalAssessment && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Inspector's Assessment</h2>
            <div className="space-y-4">
              {/* Top Positives */}
              {report.finalAssessment.topPositives && report.finalAssessment.topPositives.length > 0 && (
                <div>
                  <span className="text-green-400 font-medium block mb-2">✅ Strengths</span>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {report.finalAssessment.topPositives.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              
              {/* Top Issues */}
              {report.finalAssessment.topIssues && report.finalAssessment.topIssues.length > 0 && (
                <div>
                  <span className="text-red-400 font-medium block mb-2">⚠️ Issues to Note</span>
                  <ul className="list-disc list-inside text-red-400 space-y-1">
                    {report.finalAssessment.topIssues.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {/* Reconditioning Estimate */}
              {(report.finalAssessment.reconditioningEstimateLow || report.finalAssessment.reconditioningEstimateHigh) && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm block mb-1">Estimated Reconditioning Cost</span>
                  <p className="text-lg font-bold text-blue-400">
                    ₹{report.finalAssessment.reconditioningEstimateLow?.toLocaleString()} - ₹{report.finalAssessment.reconditioningEstimateHigh?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Ratings */}
        {report.finalAssessment?.categoryRatings && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Inspection Ratings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(report.finalAssessment.categoryRatings).map(([key, value]) => (
                <div key={key} className="bg-gray-900/50 p-3 rounded border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-white font-bold">{value}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        value >= 7 ? 'bg-green-500' : 
                        value >= 4 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center pt-8 text-gray-500 text-sm">
          <p>Professional Inspection Report by Poddar Motors RV</p>
          <p className="mt-2">Interested in this car? Call us for more details.</p>
        </div>
      </div>
    </div>
  )
}
