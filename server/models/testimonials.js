const mongoose = require('mongoose')

const testimonialsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
})

const Testimonials = mongoose.model('Testimonials', testimonialsSchema)

module.exports = Testimonials
