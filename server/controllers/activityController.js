const Activity = require('../models/activity')
const ViewCounter = require('../models/viewCounter')

// Track a view
exports.trackView = async (req, res) => {
  try {
    const { listingId } = req.params
    const sessionId = req.headers['x-session-id'] || req.ip

    // Update view counter
    let counter = await ViewCounter.findOne({ listingId })
    
    if (!counter) {
      counter = new ViewCounter({ listingId, totalViews: 0, currentViewers: [] })
    }

    // Clean stale viewers
    counter.cleanStaleViewers()

    // Check if this session is already viewing
    const existingViewer = counter.currentViewers.find(v => v.sessionId === sessionId)
    
    if (existingViewer) {
      // Update last active time
      existingViewer.lastActive = new Date()
    } else {
      // Add new viewer
      counter.currentViewers.push({ sessionId, lastActive: new Date() })
      counter.totalViews += 1
    }

    await counter.save()

    // Create activity record
    const activity = new Activity({
      type: 'view',
      listingId,
      ipAddress: req.ip
    })
    await activity.save()

    res.status(200).json({ 
      message: 'View tracked',
      totalViews: counter.totalViews,
      currentViewers: counter.currentViewers.length
    })
  } catch (error) {
    console.error('Error tracking view:', error)
    res.status(500).json({ message: 'Failed to track view', error: error.message })
  }
}

// Get viewer stats for a listing
exports.getViewerStats = async (req, res) => {
  try {
    const { listingId } = req.params

    let counter = await ViewCounter.findOne({ listingId })
    
    if (!counter) {
      return res.status(200).json({ totalViews: 0, currentViewers: 0 })
    }

    // Clean stale viewers
    const currentViewers = counter.cleanStaleViewers()
    await counter.save()

    res.status(200).json({
      totalViews: counter.totalViews,
      currentViewers
    })
  } catch (error) {
    console.error('Error getting viewer stats:', error)
    res.status(500).json({ message: 'Failed to get stats', error: error.message })
  }
}

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('listingId', 'brand model variant')

    // Format activities for display
    const formattedActivities = activities.map(activity => {
      const carName = activity.listingId 
        ? `${activity.listingId.brand} ${activity.listingId.model}`
        : activity.carName || 'a car'

      let message = ''
      const timeAgo = getTimeAgo(activity.createdAt)

      switch (activity.type) {
        case 'view':
          message = `Someone is viewing ${carName}`
          break
        case 'test_drive':
          message = activity.message || `${activity.userName || 'Someone'} booked a test drive for ${carName}`
          break
        case 'inquiry':
          message = activity.message || `${activity.userName || 'Someone'} inquired about ${carName}`
          break
        case 'purchase':
          message = activity.message || `${activity.userName || 'Someone'} purchased ${carName}`
          break
        default:
          message = activity.message || `Activity on ${carName}`
      }

      return {
        type: activity.type,
        message,
        timeAgo,
        createdAt: activity.createdAt
      }
    })

    res.status(200).json(formattedActivities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message })
  }
}

// Create activity (for test drives, inquiries, etc.)
exports.createActivity = async (req, res) => {
  try {
    const { type, listingId, carName, userName, userLocation, message } = req.body

    const activity = new Activity({
      type,
      listingId,
      carName,
      userName,
      userLocation,
      message,
      ipAddress: req.ip
    })

    await activity.save()
    res.status(201).json({ message: 'Activity tracked', activity })
  } catch (error) {
    console.error('Error creating activity:', error)
    res.status(500).json({ message: 'Failed to create activity', error: error.message })
  }
}

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
