'use client'

import { useState, useEffect } from 'react'
import { useCustomer } from '../utils/customerContext'
import { useRouter } from 'next/navigation'
import { FaCrown, FaCar, FaHeart, FaWrench, FaCog, FaSpinner } from 'react-icons/fa'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ProfilePage() {
  const { customer, loading } = useCustomer()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login')
    }
  }, [customer, loading, router])

  useEffect(() => {
    if (customer) {
      fetchDashboard()
    }
  }, [customer])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/dashboard`, {
        withCredentials: true
      })
      setDashboardData(res.data.dashboard)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || !customer) {
    return (
      <div className="min-h-screen bg-custom-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-custom-accent text-4xl" />
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaCrown /> },
    { id: 'garage', label: 'My Garage', icon: <FaWrench /> },
    { id: 'buying', label: 'Car Buying', icon: <FaCar /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
  ]

  return (
    <div className="min-h-screen bg-custom-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Welcome back, {customer.name}
            {customer.primeStatus?.isActive && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm font-bold rounded-full flex items-center gap-2">
                <FaCrown /> {customer.primeStatus.tier} Member
              </span>
            )}
          </h1>
          <p className="text-gray-400 mt-2">{customer.email} • {customer.mobile}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-custom-accent border-b-2 border-custom-accent'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {dataLoading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-custom-accent text-3xl" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Prime Status Card */}
                <div className={`p-6 rounded-lg border ${
                  customer.primeStatus?.isActive
                    ? 'bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border-yellow-500/30'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaCrown className="text-yellow-400" />
                    Prime Membership
                  </h2>
                  {customer.primeStatus?.isActive ? (
                    <div>
                      <p className="text-gray-300">Status: <span className="text-yellow-400 font-bold">{customer.primeStatus.tier} Member</span></p>
                      <p className="text-gray-300 mt-2">Benefits:</p>
                      <ul className="list-disc list-inside text-gray-400 mt-1">
                        <li>2 Free Car Washes</li>
                        <li>Priority Workshop Booking</li>
                        <li>10% Off on Services</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-400">Not a Prime member yet. Upgrade to enjoy exclusive benefits!</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-gray-400 text-sm">Workshop Bookings</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.workshopBookings?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-gray-400 text-sm">Test Drive Requests</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.testDrives?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-gray-400 text-sm">Offers Made</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.offers?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'garage' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Workshop Service History</h2>
                {dashboardData?.workshopBookings?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.workshopBookings.map((booking, idx) => (
                      <div key={idx} className="bg-white/5 p-6 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-white">{booking.serviceType}</h3>
                            <p className="text-gray-400 mt-1">{booking.carModel} • {booking.registrationNumber}</p>
                            <p className="text-sm text-gray-500 mt-2">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No workshop bookings yet.</p>
                )}
              </div>
            )}

            {activeTab === 'buying' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Car Buying Activity</h2>
                
                {/* Test Drives */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Test Drive Requests</h3>
                  {dashboardData?.testDrives?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.testDrives.map((booking, idx) => (
                        <div key={idx} className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <div className="flex items-start gap-4">
                            {booking.listing?.images?.[0] && (
                              <img 
                                src={booking.listing.images[0]} 
                                alt="Car" 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white">
                                {booking.listing?.brand} {booking.listing?.model}
                              </h4>
                              <p className="text-gray-400">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No test drive requests yet.</p>
                  )}
                </div>

                {/* Offers */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Your Offers</h3>
                  {dashboardData?.offers?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.offers.map((offer, idx) => (
                        <div key={idx} className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-bold text-white">
                                {offer.listing?.brand} {offer.listing?.model}
                              </h4>
                              <p className="text-gray-400 mt-1">
                                Your Offer: ₹{offer.offerPrice?.toLocaleString()} • 
                                Listed: ₹{offer.listing?.price?.toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              offer.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              offer.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              offer.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {offer.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No offers made yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">My Wishlist</h2>
                {customer.wishlist?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customer.wishlist.map((car, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        {car.images?.[0] && (
                          <img 
                            src={car.images[0]} 
                            alt="Car" 
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="text-lg font-bold text-white">{car.brand} {car.model}</h3>
                        <p className="text-custom-accent font-bold mt-2">₹{car.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Your wishlist is empty. Start adding cars you love!</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
