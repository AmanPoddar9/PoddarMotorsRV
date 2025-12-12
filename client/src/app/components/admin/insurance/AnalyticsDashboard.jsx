'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/insurance/analytics`, { withCredentials: true })
        setData(res.data)
    } catch (error) {
        console.error("Error fetching analytics", error)
    } finally {
        setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-8 text-gray-400">Loading Analytics...</div>
  if (!data) return <div className="text-center p-8 text-gray-400">No Data Available</div>

  // Prepare Chart Data
  const trendData = {
      labels: data.revenueTrend.map(d => {
          const date = new Date()
          date.setMonth(d._id - 1)
          return date.toLocaleString('default', { month: 'short' })
      }),
      datasets: [
          {
              label: 'Revenue (₹)',
              data: data.revenueTrend.map(d => d.revenue),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.3
          }
      ]
  }

  const conversionData = {
      labels: data.conversionStats.map(d => d._id || 'Pending'),
      datasets: [
          {
              data: data.conversionStats.map(d => d.count),
              backgroundColor: [
                  'rgba(34, 197, 94, 0.6)', // Renewed - Green
                  'rgba(239, 68, 68, 0.6)', // Not Interested - Red
                  'rgba(234, 179, 8, 0.6)', // Pending - Yellow
              ],
              borderWidth: 1,
          },
      ],
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Total Revenue (YTD)</h3>
                <p className="text-3xl font-bold text-white mt-2">₹{data.totalRevenue.toLocaleString('en-IN')}</p>
                <div className="mt-2 text-xs text-green-400">+ This Year</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-white mt-2">₹{data.monthlyRevenue.toLocaleString('en-IN')}</p>
                <div className="mt-2 text-xs text-blue-400">Current Month</div>
            </div>
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Top Agent</h3>
                 <p className="text-xl font-bold text-white mt-2">{data.agentPerformance[0]?.name || 'No Data'}</p>
                 <p className="text-sm text-gray-400">₹{data.agentPerformance[0]?.revenue.toLocaleString('en-IN') || 0} Sold</p>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
                <div className="h-64">
                    <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: '#374151' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
                </div>
            </div>

            {/* Conversion Chart */}
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Renewal Status Distribution</h3>
                <div className="h-64 flex justify-center">
                    <div className="w-64">
                         <Doughnut data={conversionData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
                 <h3 className="text-lg font-bold text-white">Agent Performance</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">Agent Name</th>
                        <th className="px-6 py-3">Policies Sold</th>
                        <th className="px-6 py-3">Revenue</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-sm text-gray-300">
                    {data.agentPerformance.map((agent, idx) => (
                        <tr key={idx} className="hover:bg-gray-750">
                            <td className="px-6 py-4">{agent.name || 'Unassigned'}</td>
                            <td className="px-6 py-4">{agent.policiesSold}</td>
                            <td className="px-6 py-4 font-mono text-green-400">₹{agent.revenue.toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                    {data.agentPerformance.length === 0 && (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No performance data record.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  )
}
