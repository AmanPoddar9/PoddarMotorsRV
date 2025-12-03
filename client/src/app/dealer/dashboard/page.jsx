'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function AuctionDashboard() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Live')

  const [dealer, setDealer] = useState(null)

  useEffect(() => {
    const storedDealer = localStorage.getItem('dealer')
    if (!storedDealer) {
      window.location.href = '/dealer/login'
      return
    }
    setDealer(JSON.parse(storedDealer))
    fetchAuctions()
  }, [filter])

  const fetchAuctions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auctions?status=${filter}`)
      const data = await res.json()
      setAuctions(data)
    } catch (error) {
      console.error('Error fetching auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date())
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dealer Auction Platform</h1>
            <p className="text-gray-400">Bid on inspected cars in real-time</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {['Live', 'Scheduled', 'Ended'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white">Loading auctions...</div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-2">No {filter} Auctions</h3>
            <p className="text-gray-400">Check back later for new listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div key={auction._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group">
                {/* Car Image Placeholder */}
                <div className="h-48 bg-gray-700 relative">
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    LIVE
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                      {auction.carDetails.year} {auction.carDetails.brand} {auction.carDetails.model}
                    </h3>
                    <p className="text-gray-300 text-sm">{auction.carDetails.variant}</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Current Bid</p>
                      <p className="text-2xl font-bold text-white">₹{(auction.currentBid / 100000).toFixed(2)} Lakh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Ends In</p>
                      <p className="text-xl font-bold text-orange-500">{formatTimeRemaining(auction.endTime)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Registration</span>
                      <span className="text-white font-medium">{auction.carDetails.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Bids</span>
                      <span className="text-white font-medium">{auction.totalBids}</span>
                    </div>
                  </div>

                  <Link
                    href={`/dealer/auction/${auction._id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 rounded-lg transition-all"
                  >
                    Enter Auction Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
