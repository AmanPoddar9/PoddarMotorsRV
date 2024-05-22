const mongoose = require('mongoose')

const listingImagesSchema = new mongoose.Schema({
  images: { type: [String], required: true },
})

const ListingImages = mongoose.model('ListingImages', listingImagesSchema)

module.exports = ListingImages
