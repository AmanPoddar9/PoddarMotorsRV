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



  return (
    <nav className="bg-custom-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link className="font-semibold text-xl text-custom-accent hover:text-yellow-400 transition-colors" href="/admin/home">
                Poddar Motors Admin
              </Link>
            </div>
            <Link
              href="/admin/home"
              className="text-custom-platinum hover:bg-white/10 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-custom-platinum hover:bg-white/10 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/admin/templates"
              className="text-custom-platinum hover:bg-white/10 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Templates
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-custom-platinum text-sm mr-4">
              Welcome, <span className="text-white font-medium">{user?.username || 'Admin'}</span>
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
