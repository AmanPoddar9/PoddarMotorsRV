const express = require('express');
const router = express.Router();
const valuationController = require('../controllers/valuationController');

// Valuation routes
router.post('/instant', valuationController.getInstantValuation);
router.get('/brands', valuationController.getPopularBrands);

module.exports = router;
