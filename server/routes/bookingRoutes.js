const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')

// Create a booking
router.post('/', bookingController.createBooking)

// Read all bookings
router.get('/', bookingController.getAllBookings)

router.get('/archived', bookingController.getArchivedBookings)

// Update a booking
router.put('/:id', bookingController.updateBooking)

// Delete a booking
router.delete('/:id', bookingController.deleteBooking)

module.exports = router
