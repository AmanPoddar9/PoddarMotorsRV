const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Get Agents
router.get('/agents', userController.getAgents);

// Create User
router.post('/', userController.createUser);

// Login is handled in authRoutes.js usually, but if we need it here:
// router.post('/login', userController.login);

module.exports = router
