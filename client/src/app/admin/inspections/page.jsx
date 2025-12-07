'use client'

import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function AdminInspectionsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [inspectorName, setInspectorName] = useState('')
  const [inspectorPhone, setInspectorPhone] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // {type: 'booking'|'report', id, name}

  useEffect(() => {
    fetchBookings()
  }, [filterStatus])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const url = filterStatus === 'all'
        ? `${API_BASE_URL}/api/inspections/bookings`
        : `${API_BASE_URL}/api/inspections/bookings?status=${filterStatus}`
      
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const assignInspector = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/bookings/${bookingId}/assign-inspector`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inspectorName, inspectorPhone })
      })

      if (res.ok) {
        alert('Inspector assigned successfully')
        setShowAssignModal(false)
        setInspectorName('')
        setInspectorPhone('')
        fetchBookings()
      } else {
        alert('Failed to assign inspector')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error assigning inspector')
    }
  }

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        alert('Status updated successfully')
        fetchBookings()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500'
      case 'Confirmed': return 'bg-blue-500'
      case 'Inspector Assigned': return 'bg-purple-500'
      case 'In Progress': return 'bg-orange-500'
      case 'Completed': return 'bg-green-500'
      case 'Cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const deleteBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.ok) {
        alert('Booking deleted successfully')
        setShowDeleteModal(false)
        setDeleteTarget(null)
        fetchBookings()
      } else {
        alert('Failed to delete booking')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting booking')
    }
  }

  const deleteReport = async (reportId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.ok) {
        alert('Report deleted successfully')
        setShowDeleteModal(false)
        setDeleteTarget(null)
        fetchBookings()
      } else {
        alert('Failed to delete report')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting report')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Inspection Bookings</h1>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'Pending', 'Confirmed', 'Inspector Assigned', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="text-white text-center py-12">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No bookings found</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {booking.brand} {booking.model}
                    </h3>
                    <p className="text-gray-400 text-sm">{booking.registrationNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-gray-300 text-sm mb-4">
                  <p><strong className="text-white">Customer:</strong> {booking.customerName}</p>
                  <p><strong className="text-white">Phone:</strong> {booking.customerPhone}</p>
                  <p><strong className="text-white">Appointment:</strong> {new Date(booking.appointmentDate).toLocaleDateString()} {booking.appointmentTimeSlot}</p>
                  <p><strong className="text-white">Location:</strong> {booking.inspectionLocation.city}</p>
                  {booking.assignedInspector?.name && (
                    <p><strong className="text-white">Inspector:</strong> {booking.assignedInspector.name}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowAssignModal(true)
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Assign Inspector
                    </button>
                  )}
                  
                  {booking.status === 'Inspector Assigned' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'In Progress')}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {booking.status === 'Completed' && booking.inspectionReportId && (
                    <button
                      onClick={() => window.location.href = `/admin/inspections/report/${booking.inspectionReportId._id || booking.inspectionReportId}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      View Report
                    </button>
                  )}

                  {booking.status === 'In Progress' && (
                    <button
                      onClick={() => window.location.href = `/admin/inspections/report/create?bookingId=${booking._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Submit Report
                    </button>
                  )}

                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                    <button
                      onClick={() => {
                        if (confirm('Cancel this booking?')) {
                          updateStatus(booking._id, 'Cancelled')
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Delete Booking Button */}
                  {(booking.status === 'Cancelled' || booking.status === 'Completed') && (
                    <button
                      onClick={() => {
                        setDeleteTarget({
                          type: 'booking',
                          id: booking._id,
                          name: `${booking.brand} ${booking.model} - ${booking.registrationNumber}`
                        })
                        setShowDeleteModal(true)
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold border border-red-400/30"
                    >
                      🗑️ Delete
                    </button>
                  )}

                  {/* Delete Report Button (only if completed with report) */}
                  {booking.status === 'Completed' && booking.inspectionReportId && (
                    <button
                      onClick={() => {
                        setDeleteTarget({
                          type: 'report',
                          id: booking.inspectionReportId._id || booking.inspectionReportId,
                          name: `Inspection Report for ${booking.brand} ${booking.model}`
                        })
                        setShowDeleteModal(true)
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-orange-400 px-4 py-2 rounded-lg text-sm font-semibold border border-orange-400/30"
                    >
                      🗑️ Delete Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Inspector Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Assign Inspector</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">Inspector Name</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter inspector name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Inspector Phone</label>
                <input
                  type="tel"
                  value={inspectorPhone}
                  onChange={(e) => setInspectorPhone(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setInspectorName('')
                  setInspectorPhone('')
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => assignInspector(selectedBooking._id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-red-600">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
              <p className="text-gray-400 text-sm">
                {deleteTarget.type === 'booking' 
                  ? 'This will permanently delete the booking and all associated data.'
                  : 'This will permanently delete the inspection report. The booking will remain but the report will be removed.'}
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-gray-300 text-sm font-medium mb-1">
                {deleteTarget.type === 'booking' ? 'Booking:' : 'Report:'}
              </p>
              <p className="text-white font-semibold">{deleteTarget.name}</p>
            </div>

            <div className="bg-red-900/20 border border-red-600/40 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-xs font-medium">⚠️ This action cannot be undone!</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteTarget(null)
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteTarget.type === 'booking') {
                    deleteBooking(deleteTarget.id)
                  } else {
                    deleteReport(deleteTarget.id)
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
