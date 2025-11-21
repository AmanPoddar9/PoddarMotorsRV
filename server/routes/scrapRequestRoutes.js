const express = require('express')
const router = express.Router()
const {
  createScrapRequest,
  getAllScrapRequests,
  getScrapRequestById,
  updateScrapRequest,
  deleteScrapRequest,
} = require('../controllers/scrapRequestController')

// Create new scrap request
router.post('/', createScrapRequest)

// Get all scrap requests
router.get('/', getAllScrapRequests)

// Get single scrap request
router.get('/:id', getScrapRequestById)

// Update scrap request
router.put('/:id', updateScrapRequest)

// Delete/archive scrap request
router.delete('/:id', deleteScrapRequest)

module.exports = router
