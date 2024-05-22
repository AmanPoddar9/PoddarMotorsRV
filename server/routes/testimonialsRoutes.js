const express = require('express')
const router = express.Router()
const testimonialsController = require('../controllers/testimonialsController')

// Create a testimonial
router.post('/', testimonialsController.createTestimonial)

// Read all testimonials
router.get('/', testimonialsController.getAllTestimonials)

// Delete one testimonial
router.delete('/:id', testimonialsController.deleteTestimonial)

module.exports = router
