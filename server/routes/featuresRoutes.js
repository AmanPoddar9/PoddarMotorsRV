const express = require('express')
const router = express.Router()
const featuresController = require('../controllers/featuresController')

// Routes
router.post('/', featuresController.createFeature)
router.get('/', featuresController.getAllFeatures)
router.delete('/:id', featuresController.deleteFeatureById)

module.exports = router
