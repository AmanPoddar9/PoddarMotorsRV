const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  logout, 
  getDashboard, 
  updatePreferences, 
  toggleWishlist,
  getAllCustomers,
  updatePrimeStatus,
  getMe,
  updateProfile
} = require('../controllers/customerAuthController.js');

// Import customer auth middleware
const { requireCustomerAuth } = require('../middleware/customerAuth');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected Routes
router.get('/dashboard', requireCustomerAuth, getDashboard);
router.put('/preferences', requireCustomerAuth, updatePreferences);
router.patch('/profile', requireCustomerAuth, updateProfile); // New Route
router.post('/wishlist', requireCustomerAuth, toggleWishlist);

// Check Auth Status (for frontend init)
router.get('/me', requireCustomerAuth, getMe);

// ADMIN Routes (require admin authentication)
const { requireAuth, requireRole } = require('../middleware/auth');
router.get('/all', requireAuth, requireRole('admin'), getAllCustomers);
router.put('/:id/prime', requireAuth, requireRole('admin'), updatePrimeStatus);

// Requirements Routes
const requirementController = require('../controllers/customerRequirementController');
router.post('/requirements', requireCustomerAuth, requirementController.createRequirement);
router.get('/requirements', requireCustomerAuth, requirementController.getRequirements);
router.delete('/requirements/:id', requireCustomerAuth, requirementController.deleteRequirement);

module.exports = router;
