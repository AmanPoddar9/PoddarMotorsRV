const express = require('express')
const router = express.Router()
const inspectionController = require('../controllers/inspectionController')

const { requireAuth, requireRole } = require('../middleware/auth');

// Booking routes
router.post('/bookings', inspectionController.createBooking) // Public (Customer)
router.get('/bookings', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.getAllBookings)
router.get('/bookings/:id', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.getBookingById)
router.put('/bookings/:id/status', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.updateBookingStatus)
router.put('/bookings/:id/assign-inspector', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.assignInspector)
router.put('/bookings/:id/payment', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.updatePaymentStatus)
router.delete('/bookings/:id', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.deleteBooking)
router.get('/slots/available', inspectionController.getAvailableSlots) // Public

// Inspector token routes
router.get('/booking-by-token/:token', inspectionController.getBookingByToken) // Public route
router.post('/bookings/:id/regenerate-token', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.regenerateInspectorToken) // Admin only


// Report routes
router.post('/reports', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.createReport)
router.get('/reports', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.getAllReports)
router.get('/reports/public/:id', inspectionController.getPublicReport) // Public
router.get('/reports/:id', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.getReportById)
router.get('/reports/booking/:bookingId', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.getReportByBookingId)
router.put('/reports/:id', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.updateReport)
router.post('/reports/:id/send-to-auction', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.sendToAuction)
router.delete('/reports/:id', requireAuth, requireRole('admin', 'inspections.manage'), inspectionController.deleteReport)

module.exports = router
