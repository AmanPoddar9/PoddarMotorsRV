'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API_URL from '../../config/api'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [funnel, setFunnel] = useState(null)
  const [dealerAnalytics, setDealerAnalytics] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 120000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, funnelRes, dealersRes, revenueRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/overview`),
        fetch(`${API_URL}/api/analytics/funnel`),
        fetch(`${API_URL}/api/analytics/dealers`),
        fetch(`${API_URL}/api/analytics/revenue?days=30`),
        fetch(`${API_URL}/api/analytics/activity?limit=10`)
      ])

      const [overviewData, funnelData, dealersData, revenueData, activityData] = await Promise.all([
        overviewRes.json(),
        funnelRes.json(),
        dealersRes.json(),
        revenueRes.json(),
        activityRes.json()
      ])

      setOverview(overviewData)
      setFunnel(funnelData)
      setDealerAnalytics(dealersData)
      setRevenue(revenueData)
      setActivity(activityData.activity)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time business insights</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inspections */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Inspections (This Month)</p>
                <p className="text-3xl font-bold text-white mt-2">{overview?.inspections.thisMonth || 0}</p>
                <p className={`text-sm mt-2 ${overview?.inspections.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {overview?.inspections.change >= 0 ? '+' : ''}{overview?.inspections.change || 0}% from last month
                </p>
              </div>
              <div className="bg-blue-900/50 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Auctions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Auctions</p>
                <p className="text-3xl font-bold text-white mt-2">{overview?.auctions.active || 0}</p>
                <p className="text-sm mt-2 text-gray-400">
                  {overview?.auctions.completed || 0} completed
                </p>
              </div>
              <div className="bg-green-900/50 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Dealers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Dealers</p>
                <p className="text-3xl font-bold text-white mt-2">{overview?.dealers.active || 0}</p>
                <p className="text-sm mt-2 text-yellow-400">
                  {overview?.dealers.pending || 0} pending approval
                </p>
              </div>
              <div className="bg-purple-900/50 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">₹{(overview?.revenue.total || 0).toLocaleString()}</p>
                <p className="text-sm mt-2 text-gray-400">Inspection fees</p>
              </div>
              <div className="bg-yellow-900/50 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Conversion Funnel</h2>
            <div className="space-y-3">
              {funnel?.funnel.map((stage, index) => {
                const maxCount = funnel.funnel[0].count
                const percentage = ((stage.count / maxCount) * 100).toFixed(1)
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{stage.stage}</span>
                      <span className="text-gray-400">{stage.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">Overall Conversion Rate</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{funnel?.conversionRate || 0}%</p>
            </div>
          </div>

          {/* Top Dealers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Top Bidders</h2>
            <div className="space-y-3">
              {dealerAnalytics?.topBidders.slice(0, 5).map((dealer, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{dealer.name}</p>
                      <p className="text-gray-400 text-sm">{dealer.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{dealer.bidCount} bids</p>
                    <p className="text-gray-400 text-sm">₹{(dealer.totalBidAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-750 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'booking' ? 'bg-blue-400' :
                  item.type === 'auction' ? 'bg-green-400' :
                  'bg-yellow-400'
                }`} />
                <div className="flex-1">
                  <p className="text-gray-300">{item.message}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Quick Links</h2>
          
          {/* Inspection Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Inspection Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link 
                href="/admin/inspections"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">All Inspections</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/inspections/bookings"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">Inspection Bookings</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/inspections/reports"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">Inspection Reports</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Auction Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Auction Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link 
                href="/admin/auctions"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">All Auctions</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/auctions?filter=Active"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">Active Auctions</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/auctions?filter=Completed"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">Completed Auctions</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Dealer Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Dealer Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link 
                href="/admin/dealers"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">All Dealers</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/dealers?status=Pending"
                className="bg-gray-800 hover:bg-gray-750 border border-yellow-600/50 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Pending Approvals</span>
                  {overview?.dealers.pending > 0 && (
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      {overview?.dealers.pending}
                    </span>
                  )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/admin/dealers?status=Approved"
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors group"
              >
                <span className="text-white font-medium">Active Dealers</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
