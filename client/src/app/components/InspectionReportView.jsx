'use client'

import { useState } from 'react'

/**
 * Shared Inspection Report View Component
 * Used by both admin and public report pages
 * 
 * @param {Object} report - The inspection report data
 * @param {boolean} isPublic - Whether this is public view (vs admin)
 * @param {boolean} showActions - Whether to show action buttons
 * @param {Function} onBack - Callback for back button
 * @param {JSX.Element} customActions - Custom action buttons (admin-specific)
 */
export default function InspectionReportView({ 
  report, 
  isPublic = false,
  showActions = true,
  onBack,
  customActions 
}) {
  const [activeTab, setActiveTab] = useState('overview')

  // Helper to handle PDF download
  const handleDownloadPDF = () => {
    window.print()
  }

  // Helper to safely render values (handles objects, arrays, primitives)
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') {
      return Array.isArray(value) ? value.join(', ') : JSON.stringify(value)
    }
    return String(value)
  }

  // Render check item (used in details tab)
  const renderCheckItem = (label, item) => {
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

  // Category definitions
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
    { id: 'transmission', title: '⚙️ Transmission & Clutch', isCheck:true },
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
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 mb-6 print:border-gray-300 print:bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 print:text-black">
                Professional Inspection Report
              </h1>
              <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-400 print:text-gray-600">
                <p>Report ID: <span className="text-white font-mono print:text-black">{report._id}</span></p>
                <p>Booking: <span className="text-white font-mono print:text-black">
                  {typeof report.bookingId === 'object' ? report.bookingId?._id : report.bookingId}
                </span></p>
                <p>Inspector: <span className="text-white print:text-black">{report.inspectorName}</span></p>
                <p>Date: <span className="text-white print:text-black">
                  {new Date(report.inspectionDate).toLocaleDateString()}
                </span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center bg-blue-600/20 border-2 border-blue-500 rounded-lg p-3 md:p-4 print:border-blue-300">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 print:text-blue-600">
                  {report.overallScore || 0}/100
                </div>
                <div className="text-sm md:text-lg font-semibold text-white mt-1 print:text-black">
                  Grade {report.finalAssessment?.overallGrade || 'N/A'}
                </div>
              </div>
              {/* Download PDF Button - Hidden in print */}
              <button
                onClick={handleDownloadPDF}
                className="no-print bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
                title="Download as PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden md:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Hidden in print */}
        <div className="no-print print:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm md:text-base ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm md:text-base ${
              activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Full Details
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm md:text-base ${
              activeTab === 'photos' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Photos
          </button>
        </div>

        {/* Tab Content */}
        <div className="print:block">
          {/* Overview Tab */}
          {(activeTab === 'overview' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'overview' ? 'hidden print:block' : ''}`}>
              {/* Vehicle Info */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 print-section print:bg-white print:border-gray-300">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4 print:text-black">
                  🚗 Vehicle Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {categories[0].fields.map(field => {
                    const rawValue = report.vehicleInfo?.[field.key]
                    const displayValue = renderValue(rawValue)
                    
                    return (
                      <div key={field.key}>
                        <p className="text-gray-500 text-xs md:text-sm print:text-gray-600">{field.label}</p>
                        <p className="font-medium text-white text-sm md:text-base print:text-black">{displayValue}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Final Assessment */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 print-section print:bg-white print:border-gray-300">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4 print:text-black">
                  📊 Final Assessment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2 print:text-green-700">✅ Top Positives</h3>
                    {report.finalAssessment?.topPositives && Array.isArray(report.finalAssessment.topPositives) && report.finalAssessment.topPositives.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm md:text-base print:text-gray-700">
                        {report.finalAssessment.topPositives.map((item, i) => (
                          <li key={i}>{String(item || '')}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300 print:text-gray-600">None listed</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-2 print:text-red-700">⚠️ Top Issues</h3>
                    {report.finalAssessment?.topIssues && Array.isArray(report.finalAssessment.topIssues) && report.finalAssessment.topIssues.length > 0 ? (
                      <ul className="list-disc list-inside text-red-400 space-y-1 text-sm md:text-base print:text-red-700">
                        {report.finalAssessment.topIssues.map((item, i) => (
                          <li key={i}>{String(item || '')}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300 print:text-gray-600">None listed</p>
                    )}
                  </div>
                </div>
                
                {/* Category Ratings */}
                {report.finalAssessment?.categoryRatings && typeof report.finalAssessment.categoryRatings === 'object' && Object.keys(report.finalAssessment.categoryRatings).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700 print:border-gray-300">
                    <h3 className="text-white font-semibold mb-4 print:text-black">Category Ratings (0-10)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(report.finalAssessment.categoryRatings).map(([key, value]) => {
                        const rating = typeof value === 'number' ? value : 0
                        return (
                          <div key={key} className="bg-gray-900/50 p-3 rounded border border-gray-700 print:bg-gray-50 print:border-gray-300">
                            <p className="text-gray-400 text-xs mb-1 capitalize print:text-gray-600">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2 print:bg-gray-300">
                                <div 
                                  className={`h-2 rounded-full ${rating >= 7 ? 'bg-green-500' : rating >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${rating * 10}%` }}
                                />
                              </div>
                              <span className="text-white font-bold text-sm print:text-black">{rating}/10</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Reconditioning Estimate */}
                {(report.finalAssessment?.reconditioningEstimateLow || report.finalAssessment?.reconditioningEstimateHigh) && (
                  <div className="mt-6 pt-6 border-t border-gray-700 print:border-gray-300">
                    <h3 className="text-white font-semibold mb-2 print:text-black">💰 Est. Reconditioning Cost</h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-400 print:text-blue-600">
                      ₹{report.finalAssessment.reconditioningEstimateLow?.toLocaleString()} - ₹{report.finalAssessment.reconditioningEstimateHigh?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Details Tab */}
          {(activeTab === 'details' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'details' ? 'hidden print:block' : ''}`}>
              {categories.slice(1).map(category => {
                try {
                  const data = report[category.id]
                  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return null

                  return (
                    <div key={category.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 print-section print:bg-white print:border-gray-300">
                      <div className="bg-gray-700 px-4 md:px-6 py-3 md:py-4 print:bg-gray-100">
                        <h3 className="text-base md:text-lg font-bold text-white print:text-black">{category.title}</h3>
                      </div>
                      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
          {(activeTab === 'photos' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'photos' ? 'hidden print:block' : ''}`}>
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 print-section print:bg-white print:border-gray-300">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4 print:text-black">📸 Inspection Photos</h2>
                {report.photos && Object.keys(report.photos).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {Object.entries(report.photos).filter(([_, url]) => url &&url !== '').map(([key, url]) => (
                      <div key={key} className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 print:bg-white print:border-gray-300">
                        <img src={url} alt={key} className="w-full h-32 md:h-48 object-cover" loading="lazy" />
                        <div className="p-2">
                          <p className="text-gray-400 text-xs capitalize print:text-gray-600">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 print:text-gray-600">No photos uploaded</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="no-print print:hidden mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                ← Back
              </button>
            )}
            {customActions}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
