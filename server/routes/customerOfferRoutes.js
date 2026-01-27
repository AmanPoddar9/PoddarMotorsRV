const express = require('express')
const router = express.Router()
const customerOfferController = require('../controllers/customerOfferController')

const { requireAuth, requireRole } = require('../middleware/auth')

// Submit a new customer offer (public or protected? usually public for now)
router.post('/', customerOfferController.createCustomerOffer)

// Get all customer offers (admin only)
router.get('/', requireAuth, requireRole('admin', 'customers.manage'), customerOfferController.getAllCustomerOffers)

// Update offer status (admin only)
router.patch('/:id/status', requireAuth, requireRole('admin', 'customers.manage'), customerOfferController.updateOfferStatus)

// Delete an offer (admin only)
router.delete('/:id', requireAuth, requireRole('admin', 'customers.manage'), customerOfferController.deleteCustomerOffer)

module.exports = router
