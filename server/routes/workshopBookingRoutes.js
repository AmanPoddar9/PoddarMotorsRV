const express = require('express')
const router = express.Router()
const workshopBookingController = require('../controllers/workshopBookingController')

// Create a booking
router.post('/', workshopBookingController.createWorkshopBooking)

// Get all bookings
router.get('/', workshopBookingController.getAllWorkshopBookings)

// Get archived bookings
router.get('/archived', workshopBookingController.getArchivedWorkshopBookings)

// Archive a booking (using PUT or PATCH usually, but reusing logic)
router.put('/:id/archive', workshopBookingController.archiveWorkshopBooking)

// Delete a booking
router.delete('/:id', workshopBookingController.deleteWorkshopBooking)

module.exports = router
