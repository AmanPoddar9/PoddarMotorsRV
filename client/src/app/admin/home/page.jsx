import AdminNavbar from '../../components/AdminNavbar'
import Link from 'next/link'
import { FiList, FiCalendar, FiMessageSquare, FiTag, FiStar, FiFileText, FiTool } from 'react-icons/fi'

const adminSections = [
  {
    title: 'Listings',
    description: 'Manage car listings',
    icon: <FiList className="w-8 h-8" />,
    href: '/admin/listings',
    color: 'bg-blue-500'
  },
  {
    title: 'Bookings',
    description: 'View car booking requests',
    icon: <FiCalendar className="w-8 h-8" />,
    href: '/admin/bookings',
    color: 'bg-green-500'
  },
  {
    title: 'Workshop Bookings',
    description: 'View workshop service bookings',
    icon: <FiTool className="w-8 h-8" />,
    href: '/admin/workshopbooking',
    color: 'bg-red-500'
  },
  {
    title: 'Testimonials',
    description: 'Manage customer testimonials',
    icon: <FiMessageSquare className="w-8 h-8" />,
    href: '/admin/testimonials',
    color: 'bg-purple-500'
  },
  {
    title: 'Offers',
    description: 'Manage special offers',
    icon: <FiTag className="w-8 h-8" />,
    href: '/admin/offers',
    color: 'bg-yellow-500'
  },
  {
    title: 'Features',
    description: 'Manage website features',
    icon: <FiStar className="w-8 h-8" />,
    href: '/admin/features',
    color: 'bg-indigo-500'
  },
  {
    title: 'Sell Requests',
    description: 'View car sell requests',
    icon: <FiFileText className="w-8 h-8" />,
    href: '/admin/sellRequests',
    color: 'bg-pink-500'
  },
  {
    title: 'Blogs',
    description: 'Manage blog posts and articles',
    icon: <FiFileText className="w-8 h-8" />,
    href: '/admin/blogs',
    color: 'bg-teal-500'
  }
]

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Manage your Poddar Motors website
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className={`${section.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600">
                  {section.description}
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
