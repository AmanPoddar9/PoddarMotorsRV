const express = require('express')
const router = express.Router()
const sellRequestController = require('../controllers/sellRequestController')

// Create a new sell request
router.post('/', sellRequestController.createSellRequest)

// Read all sell requests
router.get('/', sellRequestController.getAllSellRequests)
router.get('/archived', sellRequestController.getArchivedSellRequests)

// Delete a sell request
router.delete('/:id', sellRequestController.deleteSellRequest)

// Update the status of a sell request
router.put('/:id', sellRequestController.updateSellRequest)

module.exports = router
