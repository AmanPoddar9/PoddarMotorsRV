'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const CallAutomationPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [callLogs, setCallLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('today')
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  // Fetch call logs
  const fetchCallLogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/twilio/call-logs?limit=100`)
      setCallLogs(response.data.data)
    } catch (error) {
      console.error('Error fetching call logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/twilio/analytics?period=${period}`)
      setAnalytics(response.data.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/twilio/templates`)
      setTemplates(response.data.data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  // Mark call as contacted
  const markAsContacted = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/twilio/call-logs/${id}`, {
        contacted: true,
        contactedBy: 'Admin',
      })
      fetchCallLogs()
    } catch (error) {
      console.error('Error updating call log:', error)
    }
  }

  // Toggle follow-up required
  const toggleFollowUp = async (id, currentValue) => {
    try {
      await axios.patch(`${API_URL}/api/twilio/call-logs/${id}`, {
        followUpRequired: !currentValue,
      })
      fetchCallLogs()
    } catch (error) {
      console.error('Error updating call log:', error)
    }
  }

  useEffect(() => {
    fetchCallLogs()
    fetchAnalytics()
    fetchTemplates()
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'N/A'
    return phone.replace('whatsapp:', '').replace('+91', '+91 ')
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get service type label
  const getServiceLabel = (type) => {
    const labels = {
      'car-buying': '🚗 Car Buying',
      'workshop': '🔧 Workshop',
      'speak-to-team': '👤 Speak to Team',
      'unknown': '❓ Unknown',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Call Automation Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-custom-accent border-b-2 border-custom-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'calls'
                ? 'text-custom-accent border-b-2 border-custom-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Call Logs
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'templates'
                ? 'text-custom-accent border-b-2 border-custom-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Message Templates
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Period Selector */}
            <div className="mb-6">
              <label className="text-white mr-4">Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-custom-jet text-white px-4 py-2 rounded-md border border-white/10"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Stats Cards */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Calls</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics.totalCalls}
                      </p>
                    </div>
                    <PhoneIcon className="w-12 h-12 text-custom-accent" />
                  </div>
                </div>

                <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">SMS Sent</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics.smsStats.sent}
                      </p>
                      <p className="text-sm text-green-400 mt-1">
                        {analytics.smsStats.delivered} delivered
                      </p>
                    </div>
                    <EnvelopeIcon className="w-12 h-12 text-blue-400" />
                  </div>
                </div>

                <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">WhatsApp Sent</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics.whatsappStats.sent}
                      </p>
                      <p className="text-sm text-green-400 mt-1">
                        {analytics.whatsappStats.delivered} delivered
                      </p>
                    </div>
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-green-400" />
                  </div>
                </div>

                <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics.totalCalls > 0
                          ? Math.round((analytics.smsStats.sent / analytics.totalCalls) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <ChartBarIcon className="w-12 h-12 text-custom-accent" />
                  </div>
                </div>
              </div>
            )}

            {/* Service Distribution */}
            {analytics && analytics.serviceDistribution.length > 0 && (
              <div className="bg-custom-jet p-6 rounded-lg border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Service Distribution</h3>
                <div className="space-y-3">
                  {analytics.serviceDistribution.map((service) => (
                    <div key={service._id} className="flex items-center justify-between">
                      <span className="text-white">{getServiceLabel(service._id)}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-48 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-custom-accent h-2 rounded-full"
                            style={{
                              width: `${(service.count / analytics.totalCalls) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">
                          {service.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Peak Hours */}
            {analytics && analytics.hourlyDistribution.length > 0 && (
              <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Peak Call Hours</h3>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hourData = analytics.hourlyDistribution.find((h) => h._id === i)
                    const count = hourData ? hourData.count : 0
                    const maxCount = Math.max(...analytics.hourlyDistribution.map((h) => h.count))
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0

                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-full bg-gray-700 rounded-t h-20 flex items-end">
                          <div
                            className="w-full bg-custom-accent rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{i}h</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call Logs Tab */}
        {activeTab === 'calls' && (
          <div>
            <div className="bg-custom-jet rounded-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-custom-black/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date/Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Service</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-white">SMS</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-white">WhatsApp</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-white">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {callLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-white font-mono">
                          {formatPhone(log.from)}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {getServiceLabel(log.serviceType)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.smsStatus.sent ? (
                            log.smsStatus.delivered ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <ClockIcon className="w-5 h-5 text-yellow-400 mx-auto" />
                            )
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.whatsappStatus.sent ? (
                            log.whatsappStatus.delivered ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <ClockIcon className="w-5 h-5 text-yellow-400 mx-auto" />
                            )
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.contacted ? (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                              Contacted
                            </span>
                          ) : log.followUpRequired ? (
                            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                              Follow-up
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            {!log.contacted && (
                              <button
                                onClick={() => markAsContacted(log._id)}
                                className="px-3 py-1 text-xs bg-custom-accent hover:bg-yellow-400 text-black rounded transition-colors"
                              >
                                Mark Contacted
                              </button>
                            )}
                            <button
                              onClick={() => toggleFollowUp(log._id, log.followUpRequired)}
                              className={`px-3 py-1 text-xs rounded transition-colors ${
                                log.followUpRequired
                                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              }`}
                            >
                              {log.followUpRequired ? 'Remove Flag' : 'Flag Follow-up'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {callLogs.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-400">
                No call logs found. Calls will appear here once your Twilio number receives calls.
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="mb-6">
              <p className="text-gray-400">
                Message templates are used to send automated SMS and WhatsApp messages to customers.
                You can customize these templates in the database or via API.
              </p>
            </div>

            {templates.length === 0 ? (
              <div className="bg-custom-jet p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">No Templates Found</h3>
                <p className="text-gray-400 mb-4">
                  The system will use default templates. You can create custom templates via the API.
                </p>
                <div className="bg-custom-black/50 p-4 rounded">
                  <p className="text-sm text-gray-300 mb-2">Default SMS Template (Car Buying):</p>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                    🚗 Thank you for calling Poddar Motors RV!{'\n\n'}
                    Browse our inventory: https://poddarmotorsrv.in/buy{'\n'}
                    📍 Your showroom address{'\n'}
                    📞 Your phone number{'\n\n'}
                    Visit us today for test drives!
                  </pre>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div key={template._id} className="bg-custom-jet p-6 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        <p className="text-sm text-gray-400">
                          {template.type.toUpperCase()} • {getServiceLabel(template.serviceType)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs rounded ${
                          template.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {template.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="bg-custom-black/50 p-4 rounded">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {template.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CallAutomationPage
