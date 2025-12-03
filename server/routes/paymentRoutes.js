const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Razorpay order for inspection payment
router.post('/create-order', paymentController.createInspectionOrder);

// Verify payment signature
router.post('/verify', paymentController.verifyPayment);

// Handle payment failure
router.post('/failed', paymentController.paymentFailed);

// Get payment status
router.get('/status/:paymentId', paymentController.getPaymentStatus);

module.exports = router;
