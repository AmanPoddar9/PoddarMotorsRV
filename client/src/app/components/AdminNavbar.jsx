'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AdminNavbar = () => {
  useEffect(() => {
    const jwt_token = localStorage.getItem('jwt_token')
    if (!jwt_token) {
      window.location.href = '/admin/login'
    }
    const decodedToken = jwtDecode(jwt_token)
    if (decodedToken.access_level != 'regular') {
      window.location.href = '/admin/login'
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    window.location.href = '/admin/login'
  }
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 text-white mr-6">
              <Link className="font-semibold text-xl" href="/admin/home">
                Home
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/listings"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Listings
              </Link>
              <Link
                href="/admin/bookings"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Bookings
              </Link>
              <Link
                href="/admin/testimonials"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Testimonials
              </Link>
              <Link
                href="/admin/offers"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Offers
              </Link>
              <Link
                href="/admin/features"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="/admin/sellRequests"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sell Requests
              </Link>
            </div>
            <div className="flex flex-end">
              <button
                onClick={handleLogout}
                className="text-gray-300 bg-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium mx-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
