'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [inspectionReports, setInspectionReports] = useState([])
  
  // Form State
  const [formData, setFormData] = useState({
    inspectionReportId: '',
    startTime: '',
    endTime: '',
    startingBid: '',
    reservePrice: ''
  })

  useEffect(() => {
    fetchAuctions()
    fetchInspectionReports()
  }, [])

  const fetchAuctions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auctions`)
      const data = await res.json()
      setAuctions(data)
    } catch (error) {
      console.error('Error fetching auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInspectionReports = async () => {
    try {
      // Fetch completed reports that haven't been auctioned yet
      // For now, just fetching all reports
      const res = await fetch(`${API_BASE_URL}/api/inspections/reports`)
      const data = await res.json()
      setInspectionReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleCreateAuction = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Auction created successfully')
        setShowCreateModal(false)
        fetchAuctions()
        setFormData({
          inspectionReportId: '',
          startTime: '',
          endTime: '',
          startingBid: '',
          reservePrice: ''
        })
      } else {
        alert('Failed to create auction')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating auction')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Auction Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            + Create New Auction
          </button>
        </div>

        {/* Auctions List */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="p-4">Car</th>
                <th className="p-4">Status</th>
                <th className="p-4">Current Bid</th>
                <th className="p-4">Ends In</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {auctions.map((auction) => (
                <tr key={auction._id} className="hover:bg-gray-750">
                  <td className="p-4">
                    <div className="font-bold text-white">
                      {auction.carDetails.year} {auction.carDetails.brand} {auction.carDetails.model}
                    </div>
                    <div className="text-xs text-gray-500">{auction.carDetails.registrationNumber}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      auction.status === 'Live' ? 'bg-green-500 text-white animate-pulse' :
                      auction.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-white">₹{auction.currentBid.toLocaleString()}</td>
                  <td className="p-4">
                    {new Date(auction.endTime).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Link 
                      href={`/dealer/auction/${auction._id}`}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      View Room
                    </Link>
                    {auction.status === 'Live' && (
                      <button
                        onClick={async () => {
                          if (confirm('End this auction now?')) {
                            await fetch(`${API_BASE_URL}/api/auctions/${auction._id}/end`, { method: 'POST' })
                            fetchAuctions()
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        End Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {auctions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No auctions found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Auction</h2>
            
            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Select Inspection Report</label>
                <select
                  value={formData.inspectionReportId}
                  onChange={(e) => setFormData({...formData, inspectionReportId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a car...</option>
                  {inspectionReports.map(report => (
                    <option key={report._id} value={report._id}>
                      {report.bookingId?.brand} {report.bookingId?.model} ({report.bookingId?.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Starting Bid (₹)</label>
                  <input
                    type="number"
                    value={formData.startingBid}
                    onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 200000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Reserve Price (₹)</label>
                  <input
                    type="number"
                    value={formData.reservePrice}
                    onChange={(e) => setFormData({...formData, reservePrice: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hidden minimum"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Create Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
