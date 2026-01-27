const express = require('express')
const router = express.Router()
const sellRequestController = require('../controllers/sellRequestController')

const { requireAuth, requireRole } = require('../middleware/auth');

const { sellRequestValidation } = require('../middleware/validators');

// Create a new sell request (Public)
router.post('/', sellRequestValidation, sellRequestController.createSellRequest)

// Read all sell requests (Protected)
router.get('/', requireAuth, requireRole('admin', 'sell_requests.manage'), sellRequestController.getAllSellRequests)
router.get('/archived', requireAuth, requireRole('admin', 'sell_requests.manage'), sellRequestController.getArchivedSellRequests)

// Delete a sell request
router.delete('/:id', requireAuth, requireRole('admin', 'sell_requests.manage'), sellRequestController.deleteSellRequest)

// Update the status of a sell request
router.put('/:id', requireAuth, requireRole('admin', 'sell_requests.manage'), sellRequestController.updateSellRequest)

module.exports = router
