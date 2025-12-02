const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const multer = require('multer')

// Configure multer storage
const storage = multer.memoryStorage() // Store files in memory as buffers
const upload = multer({ storage })

const { listingValidation } = require('../middleware/validators');

// Create a listing
router.post('/', upload.single('image'), listingValidation, listingController.createListing)

router.post('/filtered', listingController.getFilteredListings)

router.post('/images', upload.single('image'), listingController.uploadImage)

const { cacheMiddleware } = require('../middleware/cache');

// Read all listings (cache for 5 minutes)
router.get('/', cacheMiddleware(300), listingController.getAllListings)

router.get('/featured', cacheMiddleware(300), listingController.getFeaturedListings)

router.get('/deals', cacheMiddleware(300), listingController.getDealListings)


router.get('/brands', cacheMiddleware(600), listingController.getAllBrands) // 10 min cache
router.get('/types', cacheMiddleware(600), listingController.getAllTypes)
router.get('/fuel', cacheMiddleware(600), listingController.getAllFuelTypes)
router.get('/transmission', cacheMiddleware(600), listingController.getAllTransmissionTypes)

router.get('/seats', cacheMiddleware(600), listingController.getAllSeats)

router.get('/slug/:slug', cacheMiddleware(300), listingController.getListingBySlug)

// Read one listing by ID
router.get('/:id', cacheMiddleware(300), listingController.getListingById)

// Update one listing by ID
router.put('/:id', listingValidation, listingController.updateListingById)

// Delete one listing by ID
router.delete('/:id', listingController.deleteListingById)

module.exports = router
