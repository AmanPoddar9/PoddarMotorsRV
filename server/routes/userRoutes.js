const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Sign up route
router.post('/signup', userController.signup)

// Login route
router.post('/login', userController.login)

module.exports = router
