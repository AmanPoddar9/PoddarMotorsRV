const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes require ADMIN role ("admin")
// Existing "admin" users are now effectively "Super Admins"
router.use(requireAuth);
router.use(requireRole('admin'));

// Get all users
router.get('/', userController.getUsers);

// Create new user (employee/admin/agent)
router.post('/', userController.createUser);

// Update user (permissions, password, etc)
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Alias /agents to / for backward compatibility if frontend uses checks for specific roles
router.get('/agents', userController.getAgents);

module.exports = router;
