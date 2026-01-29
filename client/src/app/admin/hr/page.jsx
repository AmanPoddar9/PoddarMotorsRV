'use client'

import Link from 'next/link'
import { FiBriefcase, FiFileText } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useCurrentUser } from '../../utils/useCurrentUser'

const hrSections = [
  {
    title: 'Job Applications',
    description: 'View and manage candidate applications',
    icon: <FiFileText className="w-8 h-8" />,
    href: '/admin/applications',
    color: 'bg-blue-600'
  },
  {
    title: 'Manage Jobs',
    description: 'Add, edit, or remove job listings',
    icon: <FiBriefcase className="w-8 h-8" />,
    href: '/admin/jobs',
    color: 'bg-green-600'
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

const HRDashboard = () => {
  const { user, loading } = useCurrentUser()

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-10"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-custom-accent to-yellow-500 bg-clip-text text-transparent mb-2">
            HR Manager
          </h1>
          <p className="text-custom-platinum">
            Manage your recruitment process
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
        {hrSections.map((section, index) => (
            <motion.div key={index} variants={item}>
              <Link
                href={section.href}
                className="block h-full bg-custom-jet/30 border border-white/10 hover:border-custom-accent/50 p-6 rounded-2xl transition-all duration-300 group hover:bg-custom-jet/50 hover:shadow-2xl hover:shadow-custom-accent/10 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                    <div className={`${section.color} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {section.icon}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-1 group-hover:text-custom-accent transition-colors">
                        {section.title}
                        </h2>
                        <p className="text-sm text-custom-platinum leading-relaxed group-hover:text-white transition-colors">
                        {section.description}
                        </p>
                    </div>
                </div>
              </Link>
            </motion.div>
        ))}
        </motion.div>
      </div>
    </div>
  )
}

export default HRDashboard
