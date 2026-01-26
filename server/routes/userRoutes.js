const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Get Agents - Protected, any authenticated user can see agents (for internal dropdowns)
router.get('/agents', requireAuth, userController.getAgents);

// Create User - Protected, Admin only
router.post('/', requireAuth, requireRole('admin'), userController.createUser);

// Login is handled in authRoutes.js usually, but if we need it here:
// router.post('/login', userController.login);

module.exports = router
