'use client'

import { useState, useEffect } from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import { FiTrash2, FiArchive } from 'react-icons/fi'

const WorkshopBookings = () => {
  const [bookings, setBookings] = useState([])
  const [archivedBookings, setArchivedBookings] = useState([])
  const [showArchive, setShowArchive] = useState(false)
  const [loading, setLoading] = useState(true)

  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:4000/'

  useEffect(() => {
    fetchBookings()
    if (showArchive) {
      fetchArchivedBookings()
    }
  }, [showArchive])

  const fetchBookings = async () => {
    try {
      const response = await fetch(url + 'api/workshop-bookings')
      const data = await response.json()
      setBookings(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setLoading(false)
    }
  }

  const fetchArchivedBookings = async () => {
    try {
      const response = await fetch(url + 'api/workshop-bookings/archived')
      const data = await response.json()
      setArchivedBookings(data)
    } catch (error) {
      console.error('Error fetching archived bookings:', error)
    }
  }

  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to archive this booking?')) return

    try {
      const response = await fetch(`${url}api/workshop-bookings/${id}/archive`, {
        method: 'PUT',
      })
      if (response.ok) {
        fetchBookings()
        fetchArchivedBookings()
      }
    } catch (error) {
      console.error('Error archiving booking:', error)
    }
  }

  const handleUnarchive = async (id) => {
    try {
      const response = await fetch(`${url}api/workshop-bookings/${id}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived: false }),
      })
      if (response.ok) {
        fetchBookings()
        fetchArchivedBookings()
      }
    } catch (error) {
      console.error('Error unarchiving booking:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return

    try {
      const response = await fetch(`${url}api/workshop-bookings/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchBookings()
        fetchArchivedBookings()
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Workshop Bookings</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No workshop bookings found</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <p className="font-bold text-lg text-gray-900">{booking.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Mobile: {booking.mobileNumber}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm">
                          <span className="font-semibold">Car:</span> {booking.carModel}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Service:</span> {booking.serviceType}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Date:</span> {booking.date}
                        </p>
                        {booking.message && (
                          <p className="text-sm mt-2 text-gray-600 italic">
                            "{booking.message}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArchive(booking._id)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiArchive /> Archive
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="my-6">
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {showArchive ? 'Hide' : 'Show'} Archived Bookings
              </button>
            </div>

            {showArchive && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {archivedBookings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No archived bookings</p>
                  </div>
                ) : (
                  archivedBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-gray-50 shadow-md rounded-lg p-6 border-2 border-gray-300"
                    >
                      <div className="mb-4">
                        <p className="font-bold text-lg text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600 mt-1">Mobile: {booking.mobileNumber}</p>
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-sm">
                            <span className="font-semibold">Car:</span> {booking.carModel}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-semibold">Service:</span> {booking.serviceType}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-semibold">Date:</span> {booking.date}
                          </p>
                          {booking.message && (
                            <p className="text-sm mt-2 text-gray-600 italic">
                              "{booking.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnarchive(booking._id)}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Unarchive
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WorkshopBookings
