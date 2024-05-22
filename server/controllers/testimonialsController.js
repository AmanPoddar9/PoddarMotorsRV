const Testimonials = require('../models/testimonials')

// Create a testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { text, name } = req.body
    const testimonial = new Testimonials({ text, name })
    await testimonial.save()
    res
      .status(201)
      .json({ message: 'Testimonial created successfully', testimonial })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Read all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonials.find()
    res.json(testimonials)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete one testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params
    const deletedTestimonial = await Testimonials.findByIdAndDelete(id)
    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' })
    }
    res.json({
      message: 'Testimonial deleted successfully',
      deletedTestimonial,
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
