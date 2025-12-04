const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics routes
router.get('/overview', analyticsController.getOverview);
router.get('/funnel', analyticsController.getFunnel);
router.get('/dealers', analyticsController.getDealerAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/cars', analyticsController.getCarAnalytics);
router.get('/activity', analyticsController.getRecentActivity);

module.exports = router;
