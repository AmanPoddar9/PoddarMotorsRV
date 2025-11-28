'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config/api'

const PriceAlerts = ({ listingId, currentPrice, carName }) => {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [alertType, setAlertType] = useState('price_drop') // price_drop, any_change, specific_price
  const [targetPrice, setTargetPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Pre-fill email if user is logged in
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setEmail(userData.email || '')
        setPhone(userData.phone || '')
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const alertData = {
        listingId,
        email,
        phone,
        alertType,
        targetPrice: alertType === 'specific_price' ? parseFloat(targetPrice) : null,
        currentPrice,
        carName,
      }

      await axios.post(`${API_URL}/api/price-alerts`, alertData)
      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set price alert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-custom-accent text-custom-accent font-bold rounded-full hover:bg-custom-accent hover:text-custom-black transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-custom-accent/20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Set Price Alert
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-custom-jet border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-custom-platinum hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-custom-accent to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">Price Alert</h3>
                  <p className="text-custom-platinum text-sm">{carName}</p>
                </div>
              </div>
              <div className="bg-custom-accent/10 border border-custom-accent/30 rounded-lg p-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-custom-platinum text-sm">Current Price</span>
                  <span className="text-custom-accent font-bold text-xl">₹{currentPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Alert Type */}
              <div>
                <label className="block text-white font-medium mb-3">Alert me when:</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:border-custom-accent/50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="alertType"
                      value="price_drop"
                      checked={alertType === 'price_drop'}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="mt-1 accent-custom-accent"
                    />
                    <div>
                      <div className="text-white font-medium">Price drops</div>
                      <div className="text-custom-platinum text-sm">Get notified when the price decreases</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:border-custom-accent/50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="alertType"
                      value="any_change"
                      checked={alertType === 'any_change'}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="mt-1 accent-custom-accent"
                    />
                    <div>
                      <div className="text-white font-medium">Any price change</div>
                      <div className="text-custom-platinum text-sm">Get notified for any price update</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:border-custom-accent/50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="alertType"
                      value="specific_price"
                      checked={alertType === 'specific_price'}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="mt-1 accent-custom-accent"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium mb-2">Reaches specific price</div>
                      {alertType === 'specific_price' && (
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          placeholder="Enter target price"
                          className="w-full bg-custom-black/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent"
                          required={alertType === 'specific_price'}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-custom-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent transition-colors"
                  required
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Phone Number <span className="text-custom-platinum text-sm font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-custom-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent transition-colors"
                />
                <p className="text-custom-platinum text-xs mt-1">Get SMS notifications (optional)</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price alert set successfully!
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-custom-accent text-custom-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-custom-accent/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting Alert...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Alert Set!
                  </span>
                ) : (
                  'Set Alert'
                )}
              </button>
            </form>

            {/* Footer Info */}
            <div className="p-6 pt-0">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-400 text-xs">
                    We'll notify you via email (and SMS if provided) when your alert condition is met. You can manage your alerts from your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Price Alerts Management Component (for user profile/dashboard)
export const PriceAlertsManager = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.email) {
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/api/price-alerts?email=${user.email}`)
      setAlerts(response.data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API_URL}/api/price-alerts/${alertId}`)
      setAlerts(alerts.filter(a => a._id !== alertId))
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  if (loading) {
    return <div className="text-custom-platinum">Loading alerts...</div>
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-custom-platinum mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p className="text-custom-platinum">No price alerts set</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert._id} className="bg-custom-jet border border-white/10 rounded-xl p-4 hover:border-custom-accent/30 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">{alert.carName}</h4>
              <p className="text-custom-platinum text-sm mb-2">
                Alert: {alert.alertType === 'price_drop' ? 'Price Drop' : alert.alertType === 'any_change' ? 'Any Change' : `Below ₹${alert.targetPrice?.toLocaleString()}`}
              </p>
              <div className="flex items-center gap-4 text-xs text-custom-platinum">
                <span>Current: ₹{alert.currentPrice?.toLocaleString()}</span>
                <span>•</span>
                <span>Set {new Date(alert.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => deleteAlert(alert._id)}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Delete alert"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PriceAlerts
