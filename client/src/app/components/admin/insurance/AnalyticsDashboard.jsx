'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Date Filters
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAnalytics()
  }, [startDate, endDate])

  const fetchAnalytics = async () => {
    try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/insurance/analytics`, { 
            params: { startDate, endDate },
            withCredentials: true 
        })
        setData(res.data)
        setHasError(false)
    } catch (error) {
        console.error("Error fetching analytics", error)
        setHasError(true)
    } finally {
        setLoading(false)
    }
  }

  if (hasError) return <div className="text-center p-8 text-red-400">Failed to load analytics. Please try again.</div>
  if (loading) return <div className="text-center p-8 text-gray-400">Loading Analytics...</div>
  if (!data) return <div className="text-center p-8 text-gray-400">No Data Available</div>

  // Charts
  const interactionChartData = {
      labels: data.agentActivity.map(a => a.name || 'Unknown'),
      datasets: [
          {
              label: 'Calls',
              data: data.agentActivity.map(a => a.calls),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
          },
          {
              label: 'WhatsApp',
              data: data.agentActivity.map(a => a.whatsapp),
              backgroundColor: 'rgba(34, 197, 94, 0.6)',
          }
      ]
  }

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Date Filter */}
        <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 w-fit">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">From:</span>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-purple-500"
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">To:</span>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-purple-500"
                />
            </div>
            <button onClick={fetchAnalytics} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition">
                Apply
            </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Total Premium (Selected Period)</h3>
                <p className="text-3xl font-bold text-white mt-2">₹{data.summary.totalPremium.toLocaleString('en-IN')}</p>
                <div className="mt-2 text-xs text-green-400">{data.summary.policiesRenewed} Policies Sold</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Interactions Logged</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.summary.totalInteractions}</p>
                <div className="mt-2 text-xs text-blue-400">Total Activities</div>
            </div>
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Top Performer</h3>
                 <p className="text-xl font-bold text-white mt-2">{data.conversionStats.sort((a,b) => b.totalPremium - a.totalPremium)[0]?.name || 'N/A'}</p>
                 <p className="text-sm text-gray-400">By Revenue</p>
            </div>
        </div>

        {/* Interaction Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Agent Activity Breakdown</h3>
            <div className="h-64">
                <Bar 
                    data={interactionChartData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        scales: { y: { grid: { color: '#374151' } }, x: { grid: { display: false } } },
                        plugins: { legend: { position: 'top' } } 
                    }} 
                />
            </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                     <h3 className="text-lg font-bold text-white">Sales Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Sold</th>
                                <th className="px-6 py-3">Premium</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-sm text-gray-300">
                            {data.conversionStats.map((agent, idx) => (
                                <tr key={idx} className="hover:bg-gray-750">
                                    <td className="px-6 py-4">{agent.name || 'Unassigned'}</td>
                                    <td className="px-6 py-4">{agent.policiesSold}</td>
                                    <td className="px-6 py-4 font-mono text-green-400">₹{agent.totalPremium.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                            {data.conversionStats.length === 0 && (
                                <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No sales in this period.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Activity Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                     <h3 className="text-lg font-bold text-white">Activity Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Calls</th>
                                <th className="px-6 py-3">WhatsApp</th>
                                <th className="px-6 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-sm text-gray-300">
                            {data.agentActivity.map((agent, idx) => (
                                <tr key={idx} className="hover:bg-gray-750">
                                    <td className="px-6 py-4">{agent.name || 'Unassigned'}</td>
                                    <td className="px-6 py-4">{agent.calls}</td>
                                    <td className="px-6 py-4">{agent.whatsapp}</td>
                                    <td className="px-6 py-4 font-bold">{agent.totalInteractions}</td>
                                </tr>
                            ))}
                            {data.agentActivity.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No activities recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

