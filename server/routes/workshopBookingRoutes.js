const express = require('express')
const router = express.Router()
const workshopBookingController = require('../controllers/workshopBookingController')

const { requireAuth, requireRole } = require('../middleware/auth')

const { workshopBookingValidation } = require('../middleware/validators');

// Create a booking (Public)
router.post('/', workshopBookingValidation, workshopBookingController.createWorkshopBooking)

// Get all bookings (Admin)
router.get('/', requireAuth, requireRole('admin', 'workshop.manage'), workshopBookingController.getAllWorkshopBookings)

// Get archived bookings (Admin)
router.get('/archived', requireAuth, requireRole('admin', 'workshop.manage'), workshopBookingController.getArchivedWorkshopBookings)

// Archive a booking (Admin)
router.put('/:id/archive', requireAuth, requireRole('admin', 'workshop.manage'), workshopBookingController.archiveWorkshopBooking)

// Delete a booking (Admin)
router.delete('/:id', requireAuth, requireRole('admin', 'workshop.manage'), workshopBookingController.deleteWorkshopBooking)

module.exports = router
