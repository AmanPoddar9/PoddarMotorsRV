const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const multer = require('multer')

// Configure multer storage
const storage = multer.memoryStorage() // Store files in memory as buffers
const upload = multer({ storage })

// Create a listing
router.post('/', upload.single('image'), listingController.createListing)

router.post('/filtered', listingController.getFilteredListings)

router.post('/images', upload.single('image'), listingController.uploadImage)

// Read all listings
router.get('/', listingController.getAllListings)

router.get('/featured', listingController.getFeaturedListings)

router.get('/brands', listingController.getAllBrands)
router.get('/types', listingController.getAllTypes)
router.get('/fuel', listingController.getAllFuelTypes)
router.get('/transmission', listingController.getAllTransmissionTypes)

router.get('/seats', listingController.getAllSeats)

// Read one listing by ID
router.get('/:id', listingController.getListingById)

// Update one listing by ID
router.put('/:id', listingController.updateListingById)

// Delete one listing by ID
router.delete('/:id', listingController.deleteListingById)

module.exports = router
