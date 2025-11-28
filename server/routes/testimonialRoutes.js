const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (Add auth middleware later if needed, currently open for simplicity as per request)
// In a real app, we should add verifyToken/admin middleware here
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
