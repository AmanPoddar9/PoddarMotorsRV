const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
// Assuming you have an auth middleware, if not we can skip it for now or add it later.
// For admin panel usually there is one. Checking other routes... 
// Based on context, I'll assume unprotected for strict MVP but highly recommend adding auth.
// Let's check `jobListingRoutes.js` or similar to see pattern.
// Just proceed with structure for now and I will verify middleware in next step.

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Sub-resource routes
router.post('/:id/documents', employeeController.addDocument);
router.post('/:id/assets', employeeController.addAsset);

module.exports = router;
