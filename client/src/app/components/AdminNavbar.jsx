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
    <nav className="bg-custom-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 text-white mr-6">
              <Link className="font-semibold text-xl text-custom-accent" href="/admin/home">
                Poddar Motors Admin
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/listings"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Listings
              </Link>
              <Link
                href="/admin/bookings"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Bookings
              </Link>
              <Link
                href="/admin/testimonials"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="/admin/offers"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Offers
              </Link>
              <Link
                href="/admin/features"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="/admin/sellRequests"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sell Requests
              </Link>
              <Link
                href="/admin/workshopbooking"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Workshop Bookings
              </Link>
              <Link
                href="/admin/blogs"
                className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Blogs
              </Link>
            </div>
            <div className="flex flex-end">
              <button
                onClick={handleLogout}
                className="text-custom-black bg-custom-accent hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-bold mx-4 transition-colors"
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
