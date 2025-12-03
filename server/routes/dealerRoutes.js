const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public Routes
router.post('/register', dealerController.register);
router.post('/login', dealerController.login);
router.post('/logout', dealerController.logout);

// Protected Routes (Dealer)
router.get('/profile', requireAuth, dealerController.getProfile);

// Admin Routes
router.get('/', requireAuth, requireRole('admin'), dealerController.getAllDealers);
router.put('/:id/status', requireAuth, requireRole('admin'), dealerController.updateStatus);

module.exports = router;
