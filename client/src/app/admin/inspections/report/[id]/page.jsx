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
  const [activeTab, setActiveTab] = useState('overview')

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

  const renderCheckItem = (label, item) => {
    // Handle null/undefined
    if (!item) {
      return (
        <div key={label} className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className="text-gray-500 text-xs">N/A</span>
          </div>
        </div>
      )
    }
    
    // Handle string/number values (not objects)
    if (typeof item !== 'object') {
      return (
        <div key={label} className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm font-medium">{label}</span>
            <span className="text-white text-sm">{String(item)}</span>
          </div>
        </div>
      )
    }
    
    // Handle check item object with status
    return (
      <div key={label} className="bg-gray-900/50 p-3 rounded border border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-300 text-sm font-medium">{label}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            item.status === 'Pass' ? 'bg-green-900 text-green-300' :
            item.status === 'Fail' ? 'bg-red-900 text-red-300' :
            item.status === 'Warning' ? 'bg-yellow-900 text-yellow-300' :
            'bg-gray-700 text-gray-400'
          }`}>
            {item.status || 'N/A'}
          </span>
        </div>
        {item.notes && <p className="text-gray-500 text-xs mt-1">{item.notes}</p>}
        {item.value && <p className="text-blue-400 text-xs mt-1">Value: {item.value}</p>}
      </div>
    )
  }

  const categories = [
    { id: 'vehicleInfo', title: 'Vehicle Information', fields: [
      { key: 'makeModelVariant', label: 'Make/Model/Variant' },
      { key: 'vinChassisNo', label: 'VIN/Chassis No' },
      { key: 'engineNo', label: 'Engine No' },
      { key: 'registrationNo', label: 'Registration No' },
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'manufacturingYear', label: 'Manufacturing Year' },
      { key: 'registrationYear', label: 'Registration Year' },
      { key: 'colour', label: 'Colour' },
      { key: 'carOdometer', label: 'Odometer Reading' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'ownershipNo', label: 'Ownership Number' },
    ]},
    { id: 'documentation', title: '📄 Documentation', isCheck: true },
    { id: 'features', title: '⚙️ Features & Equipment', isCheck: true },
    { id: 'warningLamps', title: '⚠️ Warning Lamps & Diagnostics', isCheck: true },
    { id: 'engine', title: '🔧 Engine & Powertrain', isCheck: true },
    { id: 'transmission', title: '⚙️ Transmission & Clutch', isCheck: true },
    { id: 'suspensionSteering', title: '🛞 Suspension & Steering', isCheck: true },
    { id: 'tyresWheels', title: '🛞 Tyres & Wheels', isCheck: true },
    { id: 'brakes', title: '🛑 Brakes', isCheck: true },
    { id: 'bodyPanels', title: '🚗 Body Panels', isCheck: true },
    { id: 'structuralIntegrity', title: '🏗️ Structural Integrity', isCheck: true },
    { id: 'paintGlass', title: '🎨 Paint & Glass', isCheck: true },
    { id: 'exteriorLights', title: '💡 Exterior Lights', isCheck: true },
    { id: 'interiorControls', title: '🪑 Interior & Controls', isCheck: true },
    { id: 'mirrorsWindowsWipers', title: '🪟 Mirrors, Windows & Wipers', isCheck: true },
    { id: 'latchesLocks', title: '🔒 Latches & Locks', isCheck: true },
    { id: 'hvacPerformance', title: '❄️ HVAC Performance', isCheck: true },
    { id: 'underbodyExhaust', title: '🔽 Underbody & Exhaust', isCheck: true },
    { id: 'drivelineAxles', title: '⚙️ Driveline & Axles', isCheck: true },
    { id: 'roadTest', title: '🚗 Road Test', isCheck: true },
    { id: 'floodFireDetection', title: '🔥 Flood/Fire Detection', isCheck: true },
    { id: 'accessoriesTools', title: '🧰 Accessories & Tools', isCheck: true },
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Professional Inspection Report</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <p className="text-gray-400">Report ID: <span className="text-white font-mono">{report._id}</span></p>
                <p className="text-gray-400">Booking ID: <span className="text-white font-mono">{typeof report.bookingId === 'object' ? report.bookingId?._id : report.bookingId}</span></p>
                <p className="text-gray-400">Inspector: <span className="text-white">{report.inspectorName}</span></p>
                <p className="text-gray-400">Date: <span className="text-white">{new Date(report.inspectionDate).toLocaleDateString()}</span></p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-center bg-blue-600/20 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-4xl font-bold text-blue-400">{report.overallScore || 0}/100</div>
                <div className="text-lg font-semibold text-white mt-1">{report.finalAssessment?.overallGrade || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Full Details
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'photos' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Photos
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">🚗 Vehicle Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories[0].fields.map(field => (
                  <div key={field.key}>
                    <p className="text-gray-500 text-sm">{field.label}</p>
                    <p className="font-medium text-white">{report.vehicleInfo?.[field.key] || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Assessment */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📊 Final Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">✅ Top Positives</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{report.finalAssessment?.topPositives || 'None listed'}</p>
                </div>
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">⚠️ Top Issues</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{report.finalAssessment?.topIssues || 'None listed'}</p>
                </div>
              </div>
              
              {/* Category Ratings */}
              {report.finalAssessment?.categoryRatings && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Category Ratings (0-10)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(report.finalAssessment.categoryRatings).map(([key, value]) => (
                      <div key={key} className="bg-gray-900/50 p-3 rounded border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${value >= 7 ? 'bg-green-500' : value >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${value * 10}%` }}
                            />
                          </div>
                          <span className="text-white font-bold text-sm">{value}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reconditioning Estimate */}
              {(report.finalAssessment?.reconditioningEstimateLow || report.finalAssessment?.reconditioningEstimateHigh) && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-2">💰 Est. Reconditioning Cost</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    ₹{report.finalAssessment.reconditioningEstimateLow?.toLocaleString()} - ₹{report.finalAssessment.reconditioningEstimateHigh?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {categories.slice(1).map(category => {
              try {
                const data = report[category.id]
                if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return null

                return (
                  <div key={category.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-700 px-6 py-4">
                      <h3 className="text-lg font-bold text-white">{category.title}</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(data).map(([key, value]) => {
                        try {
                          return renderCheckItem(key.replace(/([A-Z])/g, ' $1').trim(), value)
                        } catch (err) {
                          console.error(`Error rendering ${key}:`, err)
                          return null
                        }
                      })}
                    </div>
                  </div>
                )
              } catch (err) {
                console.error(`Error rendering category ${category.id}:`, err)
                return null
              }
            })}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📸 Inspection Photos</h2>
              {report.photos && Object.keys(report.photos).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(report.photos).filter(([_, url]) => url).map(([key, url]) => (
                    <div key={key} className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
                      <img src={url} alt={key} className="w-full h-48 object-cover" />
                      <div className="p-2">
                        <p className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No photos uploaded</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-between">
          <button
            onClick={() => router.push('/admin/inspections')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Back to Inspections
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                const url = `${window.location.origin}/report/${report._id}`
                const text = `Check out this inspection report: ${url}`
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.073-.458.076-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Share
            </button>
            
            {!report.sentToAuction && (
              <button
                onClick={() => router.push(`/admin/auctions?createFrom=${report._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Send to Auction →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
