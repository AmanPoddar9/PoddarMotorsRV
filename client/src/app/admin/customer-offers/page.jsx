'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
import { Oval } from 'react-loader-spinner'

const CustomerOffers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const apiUrl = API_URL

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/api/customer-offers`, {
        withCredentials: true,
      })
      setOffers(response.data)
    } catch (error) {
      console.error('Error fetching customer offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (offerId, newStatus) => {
    try {
      setUpdating(offerId)
      await axios.patch(
        `${apiUrl}/api/customer-offers/${offerId}/status`,
        { status: newStatus },
        { withCredentials: true }
      )
      fetchOffers()
    } catch (error) {
      console.error('Error updating offer status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    try {
      await axios.delete(`${apiUrl}/api/customer-offers/${offerId}`, {
        withCredentials: true,
      })
      fetchOffers()
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Customer Offers</h1>
          <p className="text-custom-platinum">
            View and manage customer offer submissions
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Oval color="#F59E0B" height={50} width={50} secondaryColor="#78350f" />
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-custom-jet/30 border border-white/10 rounded-lg p-8 text-center">
            <p className="text-custom-platinum text-lg">No customer offers yet</p>
          </div>
        ) : (
          <div className="bg-custom-jet/30 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-custom-jet border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Offer Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Listed Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Difference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-custom-platinum uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {offers.map((offer) => {
                    const priceDiff = offer.listing?.price - offer.offerPrice
                    const diffPercentage = offer.listing?.price
                      ? ((priceDiff / offer.listing.price) * 100).toFixed(1)
                      : 0

                    return (
                      <tr key={offer._id} className="hover:bg-custom-jet/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{offer.name}</div>
                          <div className="text-sm text-custom-platinum">{offer.mobile}</div>
                          {offer.email && (
                            <div className="text-xs text-custom-platinum/70">{offer.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {offer.listing?.images?.[0] && (
                              <img
                                src={offer.listing.images[0]}
                                alt={offer.listing.model}
                                className="h-12 w-16 rounded object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-white">
                                {offer.listing?.brand} {offer.listing?.model}
                              </div>
                              <div className="text-xs text-custom-platinum">
                                {offer.listing?.variant} • {offer.listing?.year}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-custom-accent">
                            {formatCurrency(offer.offerPrice)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {offer.listing?.price
                              ? formatCurrency(offer.listing.price)
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              priceDiff > 0 ? 'text-red-400' : 'text-green-400'
                            }`}
                          >
                            {priceDiff > 0 ? '-' : '+'}
                            {formatCurrency(Math.abs(priceDiff))}
                            <div className="text-xs text-custom-platinum">
                              ({diffPercentage}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={offer.status}
                            onChange={(e) => handleStatusChange(offer._id, e.target.value)}
                            disabled={updating === offer._id}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadgeColor(
                              offer.status
                            )} bg-transparent cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-custom-platinum">
                            {formatDate(offer.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(offer._id)}
                            className="text-red-500 hover:text-red-400 font-semibold text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && offers.length > 0 && (
          <div className="mt-4 text-sm text-custom-platinum">
            Total offers: <span className="font-semibold text-white">{offers.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerOffers
