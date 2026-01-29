const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  analyzeCall,
  getCallHistory,
  getCallDetails,
  confirmCustomerAction
} = require('../controllers/audioController');

// All routes require authentication and employee/admin role
router.use(requireAuth);
router.use(requireRole('admin', 'employee'));

// Routes
router.post('/analyze', analyzeCall);

router.get('/history', getCallHistory);

router.get('/:id', getCallDetails);

router.post('/:id/confirm-customer', confirmCustomerAction);

module.exports = router;
