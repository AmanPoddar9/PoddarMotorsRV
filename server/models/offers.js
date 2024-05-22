const mongoose = require('mongoose')

const offersSchema = new mongoose.Schema({
  image: {
    type: String, // Store image as binary data
    required: true, // Assuming image is required
  },
})

const Offers = mongoose.model('Offers', offersSchema)

module.exports = Offers
