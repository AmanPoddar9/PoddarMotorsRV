'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import io from 'socket.io-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function LiveAuctionRoom() {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [currentBid, setCurrentBid] = useState(0)
  const [bidAmount, setBidAmount] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock Dealer ID (In real app, get from auth)
  const dealerId = '656e6d7f8a9b0c1d2e3f4g5h' 
  const dealerName = 'Poddar Dealer'

  useEffect(() => {
    // 1. Fetch Auction Details
    fetchAuctionDetails()

    // 2. Connect Socket
    const newSocket = io(API_BASE_URL)
    setSocket(newSocket)

    newSocket.emit('join_auction', id)

    newSocket.on('new_bid', (data) => {
      setBids((prev) => [data, ...prev])
      setCurrentBid(data.amount)
    })

    return () => newSocket.disconnect()
  }, [id])

  useEffect(() => {
    if (auction) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const end = new Date(auction.endTime).getTime()
        const distance = end - now

        if (distance < 0) {
          clearInterval(timer)
          setTimeLeft('AUCTION ENDED')
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [auction])

  const fetchAuctionDetails = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auctions/${id}`)
      const data = await res.json()
      setAuction(data)
      setCurrentBid(data.currentBid)
      setBidAmount(data.currentBid + data.minIncrement)
      
      // Fetch existing bids
      const bidsRes = await fetch(`${API_BASE_URL}/api/auctions/${id}/bids`)
      const bidsData = await bidsRes.json()
      setBids(bidsData)
    } catch (error) {
      console.error('Error fetching auction:', error)
    } finally {
      setLoading(false)
    }
  }

  const placeBid = async () => {
    if (bidAmount <= currentBid) {
      alert('Bid must be higher than current bid')
      return
    }

    try {
      // API call to save bid
      const res = await fetch(`${API_BASE_URL}/api/auctions/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auctionId: id,
          dealerId,
          amount: bidAmount
        })
      })

      if (res.ok) {
        // Socket emit handled by server broadcast, but we can optimistically update UI if needed
        // socket.emit('place_bid', { auctionId: id, dealerId, amount: bidAmount, dealerName })
        setBidAmount(bidAmount + (auction.minIncrement || 1000))
      } else {
        alert('Failed to place bid')
      }
    } catch (error) {
      console.error('Bid error:', error)
    }
  }

  if (loading) return <div className="text-white text-center py-20">Loading Auction Room...</div>
  if (!auction) return <div className="text-white text-center py-20">Auction Not Found</div>

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Car Details & Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Header */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {auction.carDetails.year} {auction.carDetails.brand} {auction.carDetails.model}
                </h1>
                <p className="text-gray-400 text-lg">{auction.carDetails.variant} • {auction.carDetails.registrationNumber}</p>
              </div>
              <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                LIVE
              </div>
            </div>
          </div>

          {/* Inspection Report Summary */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Inspection Report</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Engine</p>
                <p className="text-green-400 font-bold">Excellent</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Exterior</p>
                <p className="text-yellow-400 font-bold">Good</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Interior</p>
                <p className="text-green-400 font-bold">Excellent</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Tyres</p>
                <p className="text-orange-400 font-bold">Fair</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all">
              View Full 100-Point Report
            </button>
          </div>
        </div>

        {/* Right Column: Bidding Console */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 sticky top-6">
            {/* Timer */}
            <div className="bg-gray-900 p-6 text-center border-b border-gray-700 rounded-t-2xl">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Time Remaining</p>
              <p className="text-4xl font-mono font-bold text-orange-500">{timeLeft}</p>
            </div>

            {/* Current Bid */}
            <div className="p-6 text-center border-b border-gray-700">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Highest Bid</p>
              <p className="text-5xl font-bold text-white">₹{(currentBid / 100000).toFixed(2)} L</p>
              <p className="text-gray-500 text-sm mt-2">₹{currentBid.toLocaleString()}</p>
            </div>

            {/* Bid Controls */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Bid Amount (₹)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setBidAmount(Math.max(bidAmount - 1000, currentBid + 1000))}
                    className="bg-gray-700 text-white px-4 rounded-lg hover:bg-gray-600"
                  >-</button>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(parseInt(e.target.value))}
                    className="w-full bg-gray-900 text-white text-center font-bold text-xl py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <button 
                    onClick={() => setBidAmount(bidAmount + 1000)}
                    className="bg-gray-700 text-white px-4 rounded-lg hover:bg-gray-600"
                  >+</button>
                </div>
              </div>

              <button
                onClick={placeBid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                PLACE BID
              </button>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Min Increment: ₹{auction.minIncrement}</span>
                <span>Reserve Met: {currentBid >= auction.reservePrice ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-gray-900 p-4 rounded-b-2xl max-h-64 overflow-y-auto">
              <h3 className="text-gray-400 text-xs uppercase font-bold mb-3">Live Bid Feed</h3>
              <div className="space-y-2">
                {bids.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">{bid.dealerName || 'Dealer'}</span>
                    </div>
                    <span className="text-white font-mono font-bold">₹{bid.amount.toLocaleString()}</span>
                  </div>
                ))}
                {bids.length === 0 && (
                  <p className="text-gray-600 text-center text-sm py-4">No bids yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
