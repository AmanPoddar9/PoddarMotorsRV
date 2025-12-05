const express = require('express')
const router = express.Router()
const templateController = require('../controllers/templateController')
// Assuming admin auth middleware exists and should be used
// const { protect, admin } = require('../middleware/authMiddleware')

// Public/Protected Routes (depending on requirements)
// For now, allowing open access or basic protection
router.get('/', templateController.getAllTemplates)
router.get('/active', templateController.getDefaultTemplate)
router.get('/:id', templateController.getTemplateById)

// Admin Routes (should be protected)
router.post('/', templateController.createTemplate)
router.put('/:id', templateController.updateTemplate)
router.delete('/:id', templateController.deleteTemplate)

module.exports = router
