'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CreateReportForm from '../../../../../components/admin/CreateReportForm'
import API_URL from '../../../../../config/api'

export default function EditReportPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inspections/reports/${params.id}`, {
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch report')
      }
      
      const data = await res.json()
      setReport(data)
    } catch (err) {
      console.error('Error fetching report:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <CreateReportForm 
        bookingIdProp={report.bookingId?._id || report.bookingId} 
        initialData={report}
        isEditMode={true}
      />
    </div>
  )
}
