'use client'
import Link from 'next/link'
import { useCurrentUser } from '../utils/useCurrentUser'
import { usePathname } from 'next/navigation'
import API_URL from '../config/api'

const AdminNavbar = () => {
  const { user, loading } = useCurrentUser()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <span className="text-custom-platinum">Loading...</span>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    // Prevent infinite loop: Only redirect if NOT already on login page
    if (typeof window !== 'undefined' && pathname !== '/admin/login') {
      window.location.href = '/admin/login'
    }
    return null
  }



  // Permissions Helper
  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Super Admin has all permissions
    return user.permissions?.includes(perm);
  };

  // Group Permissions Check
  const canAccessOperations = [
    'inspections.manage', 'auctions.manage', 'dealers.manage', 'listings.manage', 'workshop.manage'
  ].some(hasPermission);

  const canAccessCRM = [
    'customers.manage', 'insurance.manage', 'sell_requests.manage', 'test_drives.manage'
  ].some(hasPermission);

  const canAccessContent = [
    'blogs.manage', 'videos.manage', 'testimonials.manage'
  ].some(hasPermission);


  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link className="font-semibold text-xl text-custom-accent hover:text-yellow-400 transition-colors" href="/admin/home">
                Poddar Admin
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
                <Link href="/admin/home" className="text-custom-platinum hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                
                {hasPermission('dashboard.view') && (
                    <Link href="/admin/dashboard" className="text-custom-platinum hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Analysis
                    </Link>
                )}
                
                {/* Operations Dropdown */}
                {canAccessOperations && (
                    <div className="relative group">
                        <button className="text-custom-platinum hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                            Operations
                        </button>
                        <div className="absolute left-0 mt-0 w-48 bg-custom-jet border border-white/10 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {hasPermission('inspections.manage') && <Link href="/admin/inspections" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Inspections</Link>}
                            {hasPermission('auctions.manage') && <Link href="/admin/auctions" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Auctions</Link>}
                            {hasPermission('dealers.manage') && <Link href="/admin/dealers" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Dealers</Link>}
                            {hasPermission('listings.manage') && <Link href="/admin/listings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Listings</Link>}
                            {hasPermission('workshop.manage') && <Link href="/admin/workshopbooking" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Workshop</Link>}
                        </div>
                    </div>
                )}

                {/* CRM Dropdown */}
                 {canAccessCRM && (
                     <div className="relative group">
                        <button className="text-custom-platinum hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                            CRM
                        </button>
                        <div className="absolute left-0 mt-0 w-48 bg-custom-jet border border-white/10 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {hasPermission('customers.manage') && <Link href="/admin/customers" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Customers</Link>}
                            {hasPermission('insurance.manage') && <Link href="/admin/insurance" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Insurance</Link>}
                            {hasPermission('sell_requests.manage') && <Link href="/admin/sellRequests" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Sell Requests</Link>}
                            {hasPermission('test_drives.manage') && <Link href="/admin/test-drives" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Test Drives</Link>}
                        </div>
                    </div>
                )}

                {/* Content Dropdown */}
                 {canAccessContent && (
                     <div className="relative group">
                        <button className="text-custom-platinum hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                            Content
                        </button>
                        <div className="absolute left-0 mt-0 w-48 bg-custom-jet border border-white/10 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {hasPermission('blogs.manage') && <Link href="/admin/blogs" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Blogs</Link>}
                            {hasPermission('videos.manage') && <Link href="/admin/videos" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Videos</Link>}
                            {hasPermission('testimonials.manage') && <Link href="/admin/testimonials" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Testimonials</Link>}
                        </div>
                    </div>
                )}


                {/* USER MANAGEMENT (ADMIN ONLY) */}
                {user.role === 'admin' && (
                    <Link href="/admin/users" className="text-custom-accent hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-bold transition-colors">
                        Users
                    </Link>
                )}
            </div>

          </div>
          <div className="flex items-center">
            <span className="text-custom-platinum text-sm mr-4">
              Welcome, <span className="text-white font-medium">{user?.username || user?.name || 'Admin'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-custom-black bg-custom-accent hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-bold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
