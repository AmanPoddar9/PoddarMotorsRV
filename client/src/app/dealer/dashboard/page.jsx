'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API_URL from '../../config/api'

export default function AuctionDashboard() {
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Live')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('endTime')

  const [dealer, setDealer] = useState(null)
  const [canBid, setCanBid] = useState(false)

  useEffect(() => {
    // Check authentication on mount via server
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dealers/me`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          // Not authenticated, redirect to login
          localStorage.removeItem('dealer');
          window.location.href = '/dealer/login';
          return;
        }
        
        const data = await res.json();
        // Update localStorage with fresh data from server
        localStorage.setItem('dealer', JSON.stringify(data));
        setDealer(data);
        // Only approved dealers can bid
        setCanBid(data.status === 'Approved');
        fetchAuctions();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('dealer');
        window.location.href = '/dealer/login';
      }
    };
    
    checkAuth();
  }, [filter]);

  useEffect(() => {
    applyFilters()
  }, [auctions, searchQuery, priceRange, sortBy])

  const fetchAuctions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auctions?status=${filter}`)
      const data = await res.json()
      setAuctions(data)
    } catch (error) {
      console.error('Error fetching auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...auctions]

    // Search filter (brand, model, registration)
    if (searchQuery) {
      filtered = filtered.filter(auction => 
        auction.carDetails.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.carDetails.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.carDetails.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(auction => auction.currentBid >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(auction => auction.currentBid <= parseInt(priceRange.max))
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'endTime') return new Date(a.endTime) - new Date(b.endTime)
      if (sortBy === 'price-asc') return a.currentBid - b.currentBid
      if (sortBy === 'price-desc') return b.currentBid - a.currentBid
      return 0
    })

    setFilteredAuctions(filtered)
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

        {/* Filters & Search */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by brand, model, or registration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="endTime">Ending Soon</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || priceRange.min || priceRange.max) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap text-sm">
              <span className="text-gray-400">Active:</span>
              {searchQuery && <span className="bg-blue-600 px-3 py-1 rounded-full">"{searchQuery}"</span>}
              {priceRange.min && <span className="bg-blue-600 px-3 py-1 rounded-full">Min: ₹{parseInt(priceRange.min).toLocaleString()}</span>}
              {priceRange.max && <span className="bg-blue-600 px-3 py-1 rounded-full">Max: ₹{parseInt(priceRange.max).toLocaleString()}</span>}
              <button
                onClick={() => { setSearchQuery(''); setPriceRange({ min: '', max: '' }); }}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white">Loading auctions...</div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-2">
              {auctions.length === 0 ? `No ${filter} Auctions` : 'No Results Found'}
            </h3>
            <p className="text-gray-400">
              {auctions.length === 0 ? 'Check back later for new listings' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
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
