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
  updatePrimeStatus
} = require('../controllers/customerAuthController.js');
const jwt = require('jsonwebtoken');

// Middleware to verify customer token
const requireCustomerAuth = (req, res, next) => {
  const token = req.cookies?.customer_auth;
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Public Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected Routes
router.get('/dashboard', requireCustomerAuth, getDashboard);
router.put('/preferences', requireCustomerAuth, updatePreferences);
router.post('/wishlist', requireCustomerAuth, toggleWishlist);

// Check Auth Status (for frontend init)
router.get('/me', requireCustomerAuth, (req, res) => {
  res.json({ user: req.user });
});

// ADMIN Routes (require admin authentication)
const { requireAuth, requireRole } = require('../middleware/auth');
router.get('/all', requireAuth, requireRole('admin'), getAllCustomers);
router.put('/:id/prime', requireAuth, requireRole('admin'), updatePrimeStatus);

module.exports = router;
