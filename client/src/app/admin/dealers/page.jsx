'use client'

import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://www.poddarmotors.com'
)

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchDealers()
  }, [])

  const fetchDealers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dealers`, {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setDealers(data)
      }
    } catch (error) {
      console.error('Error fetching dealers:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (dealerId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dealers/${dealerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        alert(`Dealer ${status.toLowerCase()} successfully`)
        fetchDealers()
      } else {
        alert('Failed to update dealer status')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredDealers = filter === 'All' 
    ? dealers 
    : dealers.filter(d => d.status === filter)

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'bg-yellow-900 text-yellow-300',
      Approved: 'bg-green-900 text-green-300',
      Rejected: 'bg-red-900 text-red-300',
      Suspended: 'bg-gray-900 text-gray-300'
    }
    return colors[status] || 'bg-gray-900 text-gray-300'
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dealer Management</h1>
            <p className="text-gray-400">Approve or reject dealer registrations</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-20">Loading dealers...</div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">City</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDealers.map((dealer) => (
                  <tr key={dealer._id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{dealer.name}</p>
                      <p className="text-gray-400 text-sm">{dealer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{dealer.businessName}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <p>{dealer.phone}</p>
                      {dealer.gstNumber && (
                        <p className="text-xs text-gray-500">GST: {dealer.gstNumber}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{dealer.city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(dealer.status)}`}>
                        {dealer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {dealer.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(dealer._id, 'Approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(dealer._id, 'Rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {dealer.status === 'Approved' && (
                        <button
                          onClick={() => updateStatus(dealer._id, 'Suspended')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Suspend
                        </button>
                      )}
                      {dealer.status === 'Suspended' && (
                        <button
                          onClick={() => updateStatus(dealer._id, 'Approved')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDealers.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No {filter !== 'All' ? filter.toLowerCase() : ''} dealers found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
