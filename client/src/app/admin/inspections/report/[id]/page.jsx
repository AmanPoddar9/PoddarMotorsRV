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
          <div className="flex items-start gap-4">
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-500">{report.overallScore}/100</div>
              <div className="text-xl font-semibold text-white mt-1">Grade: {report.overallGrade}</div>
            </div>
            <button
              onClick={() => {
                const url = `${window.location.origin}/report/${report._id}`
                const text = `Check out this inspection report for ${report.bookingId?.brand} ${report.bookingId?.model}: ${url}`
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.073-.458.076-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Share
            </button>
            {report.sentToAuction && report.auctionId ? (
              <a
                href={`/admin/auctions`}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                View Auction
              </a>
            ) : (
              report.summary?.recommendation === 'Ready for Auction' && (
                <button
                  onClick={() => router.push(`/admin/auctions?createFrom=${report._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Send to Auction
                </button>
              )
            )}
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
