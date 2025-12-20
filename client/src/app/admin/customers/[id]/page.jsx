'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../../components/AdminNavbar'
import API_URL from '../../../config/api'
import { FiUser, FiPhone, FiMail, FiMapPin, FiTag, FiClock, FiShield } from 'react-icons/fi'

const CustomerDetailPage = ({ params }) => {
  const { id } = params
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customer/${id}`, { withCredentials: true })
        setCustomer(response.data)
      } catch (error) {
        console.error('Error fetching customer:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  if (loading) {
      return <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">Loading...</div>
  }

  if (!customer) {
      return <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">Customer not found</div>
  }

  return (
    <div className="min-h-screen bg-custom-black text-white">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{customer.name}</h1>
            <div className="flex gap-4 text-custom-platinum">
                <span className="flex items-center"><FiPhone className="mr-2 text-custom-accent"/> {customer.mobile}</span>
                {customer.email && <span className="flex items-center"><FiMail className="mr-2"/> {customer.email}</span>}
                <span className="bg-custom-jet px-2 rounded-md border border-white/10 text-sm flex items-center">{customer.source}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Identity Card */}
            <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-custom-accent flex items-center"><FiUser className="mr-2"/> Identity</h3>
                <div className="space-y-3">
                    <div>
                        <span className="text-gray-400 text-sm block">Customer ID</span>
                        <span className="font-mono">{customer.customId || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 text-sm block">City/Area</span>
                        <span><FiMapPin className="inline mr-1"/> {customer.areaCity || 'Unknown'}</span>
                    </div>
                     <div>
                        <span className="text-gray-400 text-sm block">Life Cycle</span>
                        <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 text-sm border border-blue-800">{customer.lifecycleStage || 'Lead'}</span>
                    </div>
                </div>
            </div>

            {/* Vehicles Card */}
             <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-custom-accent flex items-center"><FiTag className="mr-2"/> Vehicles</h3>
                {customer.vehicles && customer.vehicles.length > 0 ? (
                    customer.vehicles.map((v, i) => (
                        <div key={i} className="mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                            <div className="font-bold text-lg">{v.regNumber}</div>
                            <div className="text-custom-platinum">{v.make} {v.model} {v.variant}</div>
                            <div className="text-sm text-gray-400">{v.fuelType} - {v.yearOfManufacture || 'Year N/A'}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 italic">No vehicles linked directly.</div>
                )}
            </div>

             {/* Prime Status */}
             <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-custom-accent flex items-center"><FiShield className="mr-2"/> Prime Membership</h3>
                <div className="space-y-3">
                    <div>
                        <span className="text-gray-400 text-sm block">Status</span>
                        {customer.primeStatus?.isActive ? (
                            <span className="text-green-400 font-bold">Active - {customer.primeStatus.tier}</span>
                        ) : (
                            <span className="text-gray-500">Inactive</span>
                        )}
                    </div>
                </div>
            </div>

        </div>
        
        {/* Raw Data Dump (Temporary for Debugging Import) */}
        <div className="mt-8 bg-gray-900 p-4 rounded text-xs font-mono text-gray-400 overflow-x-auto">
            <h4 className="mb-2 text-custom-platinum">Debug Data</h4>
            {JSON.stringify(customer, null, 2)}
        </div>

      </div>
    </div>
  )
}

export default CustomerDetailPage
