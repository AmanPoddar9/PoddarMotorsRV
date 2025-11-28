const express = require('express')
const router = express.Router()
const activityController = require('../controllers/activityController')

// Track view
router.post('/view/:listingId', activityController.trackView)

// Get viewer stats
router.get('/viewers/:listingId', activityController.getViewerStats)

// Get recent activities
router.get('/recent', activityController.getRecentActivities)

// Create activity (test drive, inquiry, etc.)
router.post('/', activityController.createActivity)

module.exports = router
