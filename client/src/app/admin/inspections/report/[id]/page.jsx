'use client'

import { useState, useEffect } from 'react'
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
      const apiUrl = `${API_BASE_URL}/api/inspections/reports/${id}`
      console.log('Fetching report from:', apiUrl)
      console.log('Report ID:', id)
      
      const res = await fetch(apiUrl)
      console.log('Response status:', res.status)
      
      const data = await res.json()
      console.log('Response data:', data)
      
      if (res.ok) {
        setReport(data)
      } else {
        console.error('Report not found. Error:', data)
        alert(`Report not found: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
      alert(`Failed to load report: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading Report...
      </div>
    )
  }
  
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Report Not Found
      </div>
    )
  }

  // TEMPORARY: Debug-only view to identify the React rendering issue
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Warning Banner */}
        <div className="mb-6 bg-yellow-600 border border-yellow-500 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">🐛 TEMPORARY DEBUG MODE</h2>
          <p className="text-white text-sm">
            This page is temporarily showing RAW DATA ONLY to help identify what's causing the display error.
            <br />
            Once we identify the issue, the normal view will be restored.
          </p>
        </div>

        {/* Main Debug Content */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">
              Raw Report Data - ID: {id}
            </h1>
            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ← Back to Inspections
            </button>
          </div>

          {/* JSON Display */}
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
            <pre className="text-green-400 text-xs whitespace-pre-wrap">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">📋 Instructions:</h3>
            <ol className="text-white text-sm space-y-1 list-decimal list-inside">
              <li>Take a screenshot of the JSON data above</li>
              <li>Send it to the developer</li>
              <li>Look for any fields that seem unusual or have unexpected data types</li>
              <li>Pay special attention to arrays and nested objects</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
