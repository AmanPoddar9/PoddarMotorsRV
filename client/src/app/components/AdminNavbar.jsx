'use client'
import Link from 'next/link'
import { useCurrentUser } from '../utils/useCurrentUser'

const AdminNavbar = () => {
  const { user, loading } = useCurrentUser()

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    await fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <nav className="bg-custom-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <span className="text-custom-platinum">Loading...</span>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    return null
  }

  const isAdmin = user.role === 'admin'
  const canAccessBlogs = isAdmin || user.role === 'blogEditor'
  const canAccessWorkshop = isAdmin || user.role === 'bookingManager'

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
              {isAdmin && (
                <>
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
                    href="/admin/videos"
                    className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Videos
                  </Link>


                  <Link
                    href="/admin/customer-offers"
                    className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Customer Offers
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
                    href="/admin/testimonials/add"
                    className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Success Stories
                  </Link>
                  <Link
                    href="/admin/call-automation"
                    className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Call Automation
                  </Link>
                  <Link
                    href="/admin/prime"
                    className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Prime Memberships
                  </Link>
                </>
              )}
              {canAccessWorkshop && (
                <Link
                  href="/admin/workshopbooking"
                  className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Workshop Bookings
                </Link>
              )}
              {canAccessBlogs && (
                <Link
                  href="/admin/blogs"
                  className="text-custom-platinum hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Blogs
                </Link>
              )}
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
