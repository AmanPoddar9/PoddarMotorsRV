const mongoose = require('mongoose')

const featuresSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
})

const Features = mongoose.model('Features', featuresSchema)

module.exports = Features
