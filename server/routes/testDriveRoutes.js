const express = require('express')
const router = express.Router()
const testDriveController = require('../controllers/testDriveController')

const { bookingValidation } = require('../middleware/validators');

// Create a booking
router.post('/', bookingValidation, testDriveController.createBooking)

// Read all bookings
router.get('/', testDriveController.getAllBookings)

router.get('/archived', testDriveController.getArchivedBookings)

// Update a booking
router.put('/:id', testDriveController.updateBooking)

// Delete a booking
router.delete('/:id', testDriveController.deleteBooking)

module.exports = router
