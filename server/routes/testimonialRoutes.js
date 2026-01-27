const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

const { requireAuth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes
router.post('/', requireAuth, requireRole('admin', 'testimonials.manage'), createTestimonial);
router.put('/:id', requireAuth, requireRole('admin', 'testimonials.manage'), updateTestimonial);
router.delete('/:id', requireAuth, requireRole('admin', 'testimonials.manage'), deleteTestimonial);

module.exports = router;
