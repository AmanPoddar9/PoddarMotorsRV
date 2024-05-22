const express = require('express')
const router = express.Router()
const offersController = require('../controllers/offersController')
const multer = require('multer')

// Configure multer storage
const storage = multer.memoryStorage() // Store files in memory as buffers
const upload = multer({ storage })

// Create an offer
router.post('/', upload.single('image'), offersController.createOffer)

// Read all offers
router.get('/', offersController.getAllOffers)

// Delete one offer
router.delete('/:id', offersController.deleteOffer)

module.exports = router
