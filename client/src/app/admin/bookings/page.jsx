'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'
import API_URL from '../../config/api'
import * as XLSX from 'xlsx'
import moment from 'moment'

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [archivedBookings, setArchivedBookings] = useState([])

  const [showArchive, setShowArchive] = useState(false)
  
  // Function to fetch bookings from the server
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings`, { withCredentials: true })
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchArchivedBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/archived`, { withCredentials: true })
      setArchivedBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  // Function to archive a booking
  const archiveBooking = async (id) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${id}`, {
        archived: true,
      }, { withCredentials: true })
      // Refresh bookings after archiving
      fetchBookings()
      fetchArchivedBookings()
    } catch (error) {
      console.error('Error archiving booking:', error)
    }
  }

  const unArchiveBooking = async (id) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${id}`, {
        archived: false,
      }, { withCredentials: true })
      // Refresh bookings after archiving
      fetchBookings()
      fetchArchivedBookings()
    } catch (error) {
      console.error('Error archiving booking:', error)
    }
  }

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/bookings/${id}`, { withCredentials: true })
      // Refresh bookings after archiving
      fetchBookings()
    } catch (error) {
      console.error('Error archiving booking:', error)
    }
  }

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    fetchBookings()
    fetchArchivedBookings()
  }, [showArchive])

  const downloadBookings = () => {
    const tempArr = bookings.map((item) => {
      return {
        Name: item.name,
        Date: item.date,
        Time: item.time,
        'Mobile Number': item.mobileNumber,
        Brand: item.listingId?.brand,
        Model: item.listingId?.model,
        'Vehicle No.': item.listingId?.vehicleNumber,
      }
    })
    const ws = XLSX.utils.json_to_sheet(tempArr)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings')
    XLSX.writeFile(wb, `Bookings as of ${moment().format('DD-MM-YYYY')}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />

      <div className="container mx-auto mb-8 min-h-[70vh] px-4">
        <h1 className="text-3xl font-semibold mb-6 text-white pt-8">Bookings</h1>
        <div className="text-center my-4">
          <button
            onClick={() => downloadBookings()}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
          >
            Download Bookings
          </button>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-custom-jet shadow-md rounded-md p-4 border border-white/10"
            >
              <div className="mb-4 text-custom-platinum">
              {booking.listingId &&  <p className="font-semibold text-white">
                  Listing: {booking.listingId?.brand} {booking.listingId?.model} -{' '}
                  {booking.listingId?.vehicleNumber}
                </p>}
                <p className="mt-1">Name: {booking.name}</p>
                <p className="mt-1">Mobile Number: {booking.mobileNumber}</p>
                <p className="mt-1">
                  Email: {booking.email ? booking.email : 'N/A'}
                </p>
                <p className="mt-1">Date: {booking.date}</p>
                <p className="mt-1">Time: {booking.time}</p>
              </div>
              <button
                onClick={() => archiveBooking(booking._id)}
                className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
              >
                Archive
              </button>

              <button
                onClick={() => deleteBooking(booking._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold mx-4 px-4 py-2 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="my-4">
          {showArchive ? (
            <button
              onClick={() => setShowArchive(false)}
              className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
            >
              Hide Archived Bookings
            </button>
          ) : (
            <button
              onClick={() => setShowArchive(true)}
              className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
            >
              Show Archived Bookings
            </button>
          )}
        </div>

        {showArchive && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {archivedBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-custom-jet shadow-md rounded-md p-4 border border-white/10"
              >
                <div className="mb-4 text-custom-platinum">
                  <p className="font-semibold text-white">
                    Listing: {booking.listingId?.brand} {booking.listingId?.model}{' '}
                    - {booking.listingId?.vehicleNumber}
                  </p>
                  <p className="mt-1">Name: {booking.name}</p>
                  <p className="mt-1">Mobile Number: {booking.mobileNumber}</p>
                  <p className="mt-1">
                    Email: {booking.email ? booking.email : 'N/A'}
                  </p>
                  <p className="mt-1">Date: {booking.date}</p>
                  <p className="mt-1">Time: {booking.time}</p>
                </div>
                <button
                  onClick={() => unArchiveBooking(booking._id)}
                  className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
                >
                  Unarchive
                </button>

                <button
                  onClick={() => deleteBooking(booking._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold mx-4 px-4 py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingsPage
