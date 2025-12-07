'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import io from 'socket.io-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://www.poddarmotors.com'
)

import ImageGallery from '../../../components/dealer/ImageGallery'

export default function AuctionRoom({ params }) {
  const { id } = params
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [currentBid, setCurrentBid] = useState(0)
  const [bidAmount, setBidAmount] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [loading, setLoading] = useState(true)

  const [dealer, setDealer] = useState(null)
  const [canBid, setCanBid] = useState(false)

  // Socket instance, not managed by useState to avoid re-renders and connection issues
  let socket = null;

  useEffect(() => {
    // Check authentication on mount via server
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dealers/me`, {
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
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('dealer');
        window.location.href = '/dealer/login';
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // 1. Fetch Auction Details
    fetchAuctionDetails()

    // 2. Connect Socket
    socket = io(API_BASE_URL)

    socket.emit('join_auction', id)

    socket.on('new_bid', (data) => {
      setBids((prev) => [data, ...prev])
      setCurrentBid(data.amount)
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
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
          dealerId: dealer._id,
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

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Auction Room...</div>
  if (!auction) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Auction not found</div>

  const report = auction.inspectionReportId

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dealer/dashboard" className="text-gray-400 hover:text-white">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">{auction.carDetails.brand} {auction.carDetails.model} ({auction.carDetails.year})</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Current Bid</div>
              <div className="text-2xl font-bold text-green-400">₹{currentBid.toLocaleString()}</div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-mono font-bold ${
              auction.status === 'Live' ? 'bg-red-600 animate-pulse' : 'bg-gray-700'
            }`}>
              {timeLeft}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Car Details & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Image Gallery */}
          {report?.photos && <ImageGallery photos={report.photos} />}

          {/* Inspection Summary */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Inspection Report</h2>
              {auction.inspectionReportId && (
                <a
                  href={`/admin/inspections/report/${auction.inspectionReportId._id}`}
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Full Report →
                </a>
              )}
            </div>
            
            {auction.inspectionReportId ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-xs mb-1">Overall Score</p>
                    <p className="text-3xl font-bold text-white">{auction.inspectionReportId.overallScore}/100</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-xs mb-1">Grade</p>
                    <p className={`text-2xl font-bold ${
                      auction.inspectionReportId.overallGrade === 'Excellent' ? 'text-green-400' :
                      auction.inspectionReportId.overallGrade === 'Good' ? 'text-blue-400' :
                      auction.inspectionReportId.overallGrade === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {auction.inspectionReportId.overallGrade}
                    </p>
                  </div>
                </div>
                
                {auction.inspectionReportId.summary && (
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-2">Recommendation</p>
                    <p className="text-white font-semibold">{auction.inspectionReportId.summary.recommendation}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No inspection report available</p>
            )}
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

            {/* Winner / Auction Ended Notice */}
            {(auction.status === 'Sold' || auction.status === 'Ended' || auction.status === 'Unsold') && (
              <div className={`p-6 text-center border-b border-gray-700 ${
                auction.status === 'Sold' ? 'bg-green-900/30' :
                auction.status === 'Unsold' ? 'bg-red-900/30' : 'bg-gray-900/50'
              }`}>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Auction Ended</p>
                {auction.status === 'Sold' && auction.winner ? (
                  <>
                    <p className="text-2xl font-bold text-white mb-1">
                      {auction.winner._id === dealer?._id ? '🎉 You Won!' : 'Sold'}
                    </p>
                    {auction.winner._id === dealer?._id ? (
                      <p className="text-green-300 text-sm">
                        Congratulations! We'll contact you shortly with next steps.
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Won by {auction.winner.businessName}
                      </p>
                    )}
                  </>
                ) : auction.status === 'Unsold' ? (
                  <>
                    <p className="text-xl font-bold text-red-300 mb-1">Reserve Not Met</p>
                    <p className="text-gray-400 text-sm">Auction closed without sale</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-gray-300 mb-1">Auction Ended</p>
                    <p className="text-gray-400 text-sm">No bids were placed</p>
                  </>
                )}
              </div>
            )}

            {/* Bid Controls */}
            {auction.status === 'Live' && (
              <div className="p-6 space-y-4">
                {!canBid ? (
                  <div className="bg-yellow-900/30 border border-yellow-500/30 p-6 rounded-lg text-center">
                    <p className="text-yellow-300 font-bold mb-2">Account Pending Approval</p>
                    <p className="text-yellow-200 text-sm">
                      Your dealer account must be approved by admin before you can place bids.
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}

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
