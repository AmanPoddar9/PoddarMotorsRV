const express = require('express')
const router = express.Router()
const testDriveController = require('../controllers/testDriveController')

const { requireAuth, requireRole } = require('../middleware/auth');

const { bookingValidation } = require('../middleware/validators');

// Create a booking
router.post('/', bookingValidation, testDriveController.createBooking)

// Read all bookings
router.get('/', requireAuth, requireRole('admin', 'test_drives.manage'), testDriveController.getAllBookings)

router.get('/archived', requireAuth, requireRole('admin', 'test_drives.manage'), testDriveController.getArchivedBookings)

// Update a booking
router.put('/:id', requireAuth, requireRole('admin', 'test_drives.manage'), testDriveController.updateBooking)

// Delete a booking
router.delete('/:id', requireAuth, requireRole('admin', 'test_drives.manage'), testDriveController.deleteBooking)

module.exports = router
