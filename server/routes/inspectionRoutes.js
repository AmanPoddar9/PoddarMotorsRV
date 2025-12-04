const express = require('express')
const router = express.Router()
const inspectionController = require('../controllers/inspectionController')

// Booking routes
router.post('/bookings', inspectionController.createBooking)
router.get('/bookings', inspectionController.getAllBookings)
router.get('/bookings/:id', inspectionController.getBookingById)
router.put('/bookings/:id/status', inspectionController.updateBookingStatus)
router.put('/bookings/:id/assign-inspector', inspectionController.assignInspector)
router.put('/bookings/:id/payment', inspectionController.updatePaymentStatus)
router.get('/slots/available', inspectionController.getAvailableSlots)

// Report routes
router.post('/reports', inspectionController.createReport)
router.get('/reports', inspectionController.getAllReports)
router.get('/reports/public/:id', inspectionController.getPublicReport)
router.get('/reports/:id', inspectionController.getReportById)
router.get('/reports/booking/:bookingId', inspectionController.getReportByBookingId)
router.put('/reports/:id', inspectionController.updateReport)
router.post('/reports/:id/send-to-auction', inspectionController.sendToAuction)
router.delete('/reports/:id', inspectionController.deleteReport)

module.exports = router
