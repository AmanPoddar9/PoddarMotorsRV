const express = require('express')
const router = express.Router()
const customerOfferController = require('../controllers/customerOfferController')

// Submit a new customer offer
router.post('/', customerOfferController.createCustomerOffer)

// Get all customer offers (admin only)
router.get('/', customerOfferController.getAllCustomerOffers)

// Update offer status (admin only)
router.patch('/:id/status', customerOfferController.updateOfferStatus)

// Delete an offer (admin only)
router.delete('/:id', customerOfferController.deleteCustomerOffer)

module.exports = router
