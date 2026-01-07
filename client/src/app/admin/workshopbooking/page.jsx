'use client'

import { useState, useEffect } from 'react'
import API_URL from '../../config/api'
import { FiTrash2, FiArchive } from 'react-icons/fi'

const WorkshopBookings = () => {
  const [bookings, setBookings] = useState([])
  const [archivedBookings, setArchivedBookings] = useState([])
  const [showArchive, setShowArchive] = useState(false)
  const [loading, setLoading] = useState(true)

  // const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const url = API_URL

  useEffect(() => {
    fetchBookings()
    if (showArchive) {
      fetchArchivedBookings()
    }
  }, [showArchive])

  const fetchBookings = async () => {
    try {
      const response = await fetch(url + '/api/workshop-bookings', { credentials: 'include' })
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
      const response = await fetch(url + '/api/workshop-bookings/archived', { credentials: 'include' })
      const data = await response.json()
      setArchivedBookings(data)
    } catch (error) {
      console.error('Error fetching archived bookings:', error)
    }
  }

  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to archive this booking?')) return

    try {
      const response = await fetch(`${url}/api/workshop-bookings/${id}/archive`, {
        method: 'PUT',
        credentials: 'include',
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
      const response = await fetch(`${url}/api/workshop-bookings/${id}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived: false }),
        credentials: 'include',
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
      const response = await fetch(`${url}/api/workshop-bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
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
    <div className="min-h-screen bg-custom-black">
      <div className="container mx-auto px-4 py-8 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-white mb-6">Workshop Bookings</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-accent"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-custom-platinum text-lg">No workshop bookings found</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-custom-jet shadow-md rounded-lg p-6 hover:shadow-xl hover:shadow-custom-accent/10 transition-all border border-white/10"
                  >
                    <div className="mb-4">
                      <p className="font-bold text-lg text-white">{booking.name}</p>
                      <p className="text-sm text-custom-platinum mt-1">Mobile: {booking.mobileNumber}</p>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-sm text-custom-platinum">
                          <span className="font-semibold text-white">Car:</span> {booking.carModel}
                        </p>
                        <p className="text-sm mt-1 text-custom-platinum">
                          <span className="font-semibold text-white">Service:</span> {booking.serviceType}
                        </p>
                        <p className="text-sm mt-1 text-custom-platinum">
                          <span className="font-semibold text-white">Date:</span> {booking.date}
                        </p>
                        {booking.message && (
                          <p className="text-sm mt-2 text-custom-platinum italic">
                            "{booking.message}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArchive(booking._id)}
                        className="flex-1 bg-custom-accent text-custom-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <FiArchive /> Archive
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold"
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
                className="bg-custom-accent text-custom-black px-6 py-2 rounded-md hover:bg-yellow-400 transition-colors font-semibold"
              >
                {showArchive ? 'Hide' : 'Show'} Archived Bookings
              </button>
            </div>

            {showArchive && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {archivedBookings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-custom-platinum text-lg">No archived bookings</p>
                  </div>
                ) : (
                  archivedBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-custom-jet/50 shadow-md rounded-lg p-6 border-2 border-white/20"
                    >
                      <div className="mb-4">
                        <p className="font-bold text-lg text-white">{booking.name}</p>
                        <p className="text-sm text-custom-platinum mt-1">Mobile: {booking.mobileNumber}</p>
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-sm text-custom-platinum">
                            <span className="font-semibold text-white">Car:</span> {booking.carModel}
                          </p>
                          <p className="text-sm mt-1 text-custom-platinum">
                            <span className="font-semibold text-white">Service:</span> {booking.serviceType}
                          </p>
                          <p className="text-sm mt-1 text-custom-platinum">
                            <span className="font-semibold text-white">Date:</span> {booking.date}
                          </p>
                          {booking.message && (
                            <p className="text-sm mt-2 text-custom-platinum italic">
                              "{booking.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnarchive(booking._id)}
                          className="flex-1 bg-custom-accent text-custom-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors font-semibold"
                        >
                          Unarchive
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold"
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
