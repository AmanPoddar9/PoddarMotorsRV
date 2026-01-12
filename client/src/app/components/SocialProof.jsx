'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config/api'

const SocialProof = () => {
  const [activities, setActivities] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activities.length > 0) {
      const rotationInterval = setInterval(() => {
        setVisible(false)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % activities.length)
          setVisible(true)
        }, 300)
      }, 5000) // Rotate every 5 seconds

      return () => clearInterval(rotationInterval)
    }
  }, [activities])

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/activities/recent`)
      setActivities(response.data)
    } catch (error) {
      // Fallback to demo data if API not ready
      setActivities(getDemoActivities())
    }
  }

  if (activities.length === 0) return null

  const currentActivity = activities[currentIndex]

  return (
    <>
      {/* Desktop: Bottom Left Notification */}
      <div className="hidden md:block fixed bottom-8 left-8 z-40">
        <div
          className={`glass-dark border border-white/20 rounded-2xl shadow-2xl max-w-sm transform transition-all duration-300 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="p-4 flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-custom-accent to-yellow-600 flex items-center justify-center shadow-lg">
                {getActivityIcon(currentActivity.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm mb-1">
                {currentActivity.message}
              </p>
              <p className="text-custom-platinum text-xs">
                {currentActivity.timeAgo}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 text-custom-platinum hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/10 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-custom-accent transition-all duration-5000 ease-linear"
              style={{ width: visible ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile: Top Notification */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-40">
        <div
          className={`glass-dark border border-white/20 rounded-xl shadow-2xl transform transition-all duration-300 ${
            visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="p-3 flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-custom-accent to-yellow-600 flex items-center justify-center shadow-lg">
                {getActivityIcon(currentActivity.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-xs mb-0.5 truncate">
                {currentActivity.message}
              </p>
              <p className="text-custom-platinum text-xs">
                {currentActivity.timeAgo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// View Counter Component for Car Listings
export const ViewCounter = ({ listingId, initialCount = 0 }) => {
  const [viewCount, setViewCount] = useState(initialCount)
  const [currentViewers, setCurrentViewers] = useState(0)

  useEffect(() => {
    // Track this view
    trackView()
    
    // Get current viewers
    const fetchViewers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/activities/viewers/${listingId}`)
        setCurrentViewers(response.data.currentViewers || 0)
        setViewCount(response.data.totalViews || initialCount)
      } catch (error) {
        // Use demo data
        setCurrentViewers(Math.floor(Math.random() * 8) + 1)
      }
    }

    fetchViewers()
    const interval = setInterval(fetchViewers, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [listingId])

  const trackView = async () => {
    try {
      await axios.post(`${API_URL}/api/activities/view/${listingId}`)
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Current Viewers */}
      {currentViewers > 0 && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
          <div className="flex -space-x-1">
            {[...Array(Math.min(currentViewers, 3))].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-2 border-custom-jet flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            ))}
          </div>
          <span className="text-white font-medium">
            {currentViewers} {currentViewers === 1 ? 'person' : 'people'} viewing
          </span>
        </div>
      )}

      {/* Total Views */}
      <div className="flex items-center gap-2 text-custom-platinum">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{viewCount.toLocaleString()} views</span>
      </div>
    </div>
  )
}

// Recent Activity Badge for Homepage
export const RecentActivityBadge = ({ count = 0 }) => {
  if (count === 0) return null

  return (
    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
      <div className="relative">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
      </div>
      <span className="text-white font-medium text-sm">
        {count} recent {count === 1 ? 'inquiry' : 'inquiries'} today
      </span>
    </div>
  )
}

// Helper Functions
function getActivityIcon(type) {
  switch (type) {
    case 'test_drive':
      return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'purchase':
      return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'inquiry':
      return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    default:
      return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
  }
}

function getDemoActivities() {
  const names = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Kavita']
  const cities = ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh']
  const cars = ['Honda City', 'Hyundai Creta', 'Maruti Swift', 'Tata Nexon', 'Mahindra XUV500']
  const types = ['test_drive', 'inquiry', 'purchase']
  const messages = [
    (name, city, car) => `${name} from ${city} just booked a test drive for ${car}`,
    (name, city, car) => `${name} in ${city} is viewing ${car}`,
    (name, city, car) => `${name} from ${city} recently purchased ${car}`,
  ]

  return Array.from({ length: 10 }, (_, i) => {
    const name = names[Math.floor(Math.random() * names.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const car = cars[Math.floor(Math.random() * cars.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const messageTemplate = messages[Math.floor(Math.random() * messages.length)]
    const minutesAgo = Math.floor(Math.random() * 120) + 1

    return {
      type,
      message: messageTemplate(name, city, car),
      timeAgo: minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`,
    }
  })
}

export default SocialProof
