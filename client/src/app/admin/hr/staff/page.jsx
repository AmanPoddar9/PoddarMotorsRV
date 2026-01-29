'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch, FiFilter, FiUser, FiPhone, FiMail } from 'react-icons/fi'
import axios from 'axios'
import AddEmployeeModal from '../../../components/admin/hr/AddEmployeeModal'
import API_URL from '../../../config/api'

const StaffPage = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees`)
      setEmployees(res.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-custom-accent to-purple-500 bg-clip-text text-transparent mb-2">
              Staff Management
            </h1>
            <p className="text-custom-platinum">
              Manage your employee database & profiles
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-custom-accent hover:bg-custom-accent/80 text-black px-6 py-3 rounded-xl font-bold transition-all"
          >
            <FiPlus /> Add Employee
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by name or department..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-custom-jet/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-custom-accent/50"
                />
            </div>
            {/* Future: Add Department Filter Dropdown here */}
        </div>

        {/* Employee Grid */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading staff...</div>
        ) : (
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredEmployees.map(emp => (
                    <motion.div key={emp._id} variants={item}>
                        <Link href={`/admin/hr/staff/${emp._id}`}>
                            <div className="group bg-custom-jet/30 border border-white/10 p-6 rounded-2xl hover:bg-custom-jet/50 transition-all cursor-pointer h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                         emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                     }`}>
                                         {emp.status}
                                     </span>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-custom-accent/20 rounded-full flex items-center justify-center text-custom-accent font-bold text-xl">
                                        {emp.firstName[0]}{emp.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-custom-accent transition-colors">
                                            {emp.firstName} {emp.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-400">{emp.designation}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <FiUser /> {emp.department}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiMail /> {emp.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiPhone /> {emp.phone}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {filteredEmployees.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No employees found matching your search.
                    </div>
                )}
            </motion.div>
        )}

        {/* Add Modal */}
        {showAddModal && (
            <AddEmployeeModal 
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                    setShowAddModal(false)
                    fetchEmployees()
                }}
            />
        )}

      </div>
    </div>
  )
}

export default StaffPage
