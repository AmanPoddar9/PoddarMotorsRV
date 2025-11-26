const express = require('express')
const router = express.Router()
const workshopBookingController = require('../controllers/workshopBookingController')

const { requireAuth, requireRole } = require('../middleware/auth')

// Create a booking (Public)
router.post('/', workshopBookingController.createWorkshopBooking)

// Get all bookings (Admin)
router.get('/', requireAuth, requireRole('admin', 'bookingManager'), workshopBookingController.getAllWorkshopBookings)

// Get archived bookings (Admin)
router.get('/archived', requireAuth, requireRole('admin', 'bookingManager'), workshopBookingController.getArchivedWorkshopBookings)

// Archive a booking (Admin)
router.put('/:id/archive', requireAuth, requireRole('admin', 'bookingManager'), workshopBookingController.archiveWorkshopBooking)

// Delete a booking (Admin)
router.delete('/:id', requireAuth, requireRole('admin', 'bookingManager'), workshopBookingController.deleteWorkshopBooking)

module.exports = router
