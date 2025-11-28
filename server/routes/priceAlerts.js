const express = require('express')
const router = express.Router()
const priceAlertController = require('../controllers/priceAlertController')

// Create price alert
router.post('/', priceAlertController.createPriceAlert)

// Get user's alerts
router.get('/', priceAlertController.getUserAlerts)

// Delete alert
router.delete('/:id', priceAlertController.deletePriceAlert)

// Check alerts for a listing (admin/cron)
router.post('/check/:listingId', priceAlertController.checkPriceAlerts)

module.exports = router
