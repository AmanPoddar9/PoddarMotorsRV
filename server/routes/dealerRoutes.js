const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealerController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireDealerAuth } = require('../middleware/dealerAuth');

// Public Routes
router.post('/register', dealerController.register);
router.post('/login', dealerController.login);
router.post('/logout', dealerController.logout);

// Protected Routes (Dealer) - use dealer-specific middleware
router.get('/me', requireDealerAuth, dealerController.getMe);
router.get('/profile', requireDealerAuth, dealerController.getProfile);

// Admin Routes - admin can manage dealers
router.get('/', requireAuth, requireRole('admin'), dealerController.getAllDealers);
router.put('/:id/status', requireAuth, requireRole('admin'), dealerController.updateStatus);

module.exports = router;

