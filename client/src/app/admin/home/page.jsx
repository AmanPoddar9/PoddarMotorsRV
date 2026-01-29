'use client'

import Link from 'next/link'
import { FiList, FiCalendar, FiMessageSquare, FiTag, FiStar, FiFileText, FiTool, FiVideo, FiPhone, FiAward, FiUsers, FiClipboard, FiDollarSign, FiUserCheck, FiPieChart, FiShield, FiUpload } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useCurrentUser } from '../../utils/useCurrentUser'

const adminSections = [
  {
    title: 'Inspections',
    description: 'Manage car inspections & reports',
    icon: <FiClipboard className="w-8 h-8" />,
    href: '/admin/inspections',
    color: 'bg-blue-600',
    permission: 'inspections.manage'
  },
  {
    title: 'Unified Customers',
    description: 'View 360° Profiles & Leads',
    icon: <FiUsers className="w-8 h-8" />,
    href: '/admin/customers',
    color: 'bg-purple-700',
    permission: 'customers.manage'
  },
  {
    title: 'Auctions',
    description: 'Manage live car auctions',
    icon: <FiDollarSign className="w-8 h-8" />,
    href: '/admin/auctions',
    color: 'bg-green-600',
    permission: 'auctions.manage'
  },
  {
    title: 'Dealers',
    description: 'Manage dealer accounts',
    icon: <FiUserCheck className="w-8 h-8" />,
    href: '/admin/dealers',
    color: 'bg-purple-600',
    permission: 'dealers.manage'
  },
  {
    title: 'Listings',
    description: 'Manage car listings',
    icon: <FiList className="w-8 h-8" />,
    href: '/admin/listings',
    color: 'bg-blue-500',
    permission: 'listings.manage'
  },
  {
    title: 'Test Drives',
    description: 'View test drive bookings',
    icon: <FiCalendar className="w-8 h-8" />,
    href: '/admin/test-drives',
    color: 'bg-green-500',
    permission: 'test_drives.manage'
  },
  {
    title: 'Workshop Bookings',
    description: 'View workshop service bookings',
    icon: <FiTool className="w-8 h-8" />,
    href: '/admin/workshopbooking',
    color: 'bg-red-500',
    permission: 'workshop.manage'
  },
  {
    title: 'Testimonials',
    description: 'Manage customer testimonials',
    icon: <FiMessageSquare className="w-8 h-8" />,
    href: '/admin/testimonials',
    color: 'bg-purple-500',
    permission: 'testimonials.manage'
  },

  {
    title: 'Features',
    description: 'Manage website features',
    icon: <FiStar className="w-8 h-8" />,
    href: '/admin/features',
    color: 'bg-indigo-500',
    permission: 'admin' // Only admins
  },
  {
    title: 'Sell Requests',
    description: 'View car sell requests',
    icon: <FiFileText className="w-8 h-8" />,
    href: '/admin/sellRequests',
    color: 'bg-pink-500',
    permission: 'sell_requests.manage'
  },
  {
    title: 'Blogs',
    description: 'Manage blog posts and articles',
    icon: <FiFileText className="w-8 h-8" />,
    href: '/admin/blogs',
    color: 'bg-teal-500',
    permission: 'blogs.manage'
  },
  {
    title: 'Videos',
    description: 'Manage video content',
    icon: <FiVideo className="w-8 h-8" />,
    href: '/admin/videos',
    color: 'bg-orange-500',
    permission: 'videos.manage'
  },
  {
    title: 'Customer Offers',
    description: 'Manage customer offers',
    icon: <FiUsers className="w-8 h-8" />,
    href: '/admin/customer-offers',
    color: 'bg-cyan-500',
    permission: 'customers.manage'
  },
  {
    title: 'Call Automation',
    description: 'Manage call automation settings',
    icon: <FiPhone className="w-8 h-8" />,
    href: '/admin/call-automation',
    color: 'bg-lime-500',
    permission: 'admin'
  },
  {
    title: 'Prime Memberships',
    description: 'Manage prime memberships',
    icon: <FiAward className="w-8 h-8" />,
    href: '/admin/prime',
    color: 'bg-rose-500',
    permission: 'customers.manage'
  },
  {
    title: 'Inspection Analytics',
    description: 'View inspection analytics',
    icon: <FiPieChart className="w-8 h-8" />,
    href: '/admin/dashboard',
    color: 'bg-indigo-600',
    permission: 'dashboard.view'
  },
  {
    title: 'Insurance',
    description: 'Manage insurance policies',
    icon: <FiShield className="w-8 h-8" />,
    href: '/admin/insurance',
    color: 'bg-emerald-600',
    permission: 'insurance.manage'
  },
  {
    title: 'Data Import',
    description: 'Bulk upload customers/data',
    icon: <FiUpload className="w-8 h-8" />,
    href: '/admin/import',
    color: 'bg-orange-600',
    permission: 'admin'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const Home = () => {
  const { user, loading } = useCurrentUser()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  // Filter sections based on permissions
  const visibleSections = adminSections.filter(section => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Super Admin sees all
    
    // For specific role permissions
    if (section.permission === 'admin') return false; // Explicitly Admin only
    
    // Check permission array
    return user.permissions?.includes(section.permission);
  });

  return (
    <div className="min-h-screen"> 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Welcome back, <span className="text-white font-medium">{user?.name || user?.username || 'Admin'}</span>
          </p>
        </motion.div>

        {visibleSections.length > 0 ? (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
            {visibleSections.map((section, index) => (
                <motion.div key={index} variants={item}>
                  <Link
                    href={section.href}
                    className="block h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-custom-accent/50 p-6 transition-all duration-300 group hover:bg-white/10 hover:shadow-2xl hover:shadow-custom-accent/10 hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-4">
                        <div className={`${section.color} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {section.icon}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1 group-hover:text-custom-accent transition-colors">
                            {section.title}
                            </h2>
                            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                            {section.description}
                            </p>
                        </div>
                    </div>
                  </Link>
                </motion.div>
            ))}
            </motion.div>
        ) : (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <h3 className="text-xl text-white font-semibold">No modules assigned</h3>
                <p className="text-gray-400 mt-2">Please ask an administrator to assign permissions to your account.</p>
            </div>
        )}
      </main>
    </div>
  )
}

export default Home
