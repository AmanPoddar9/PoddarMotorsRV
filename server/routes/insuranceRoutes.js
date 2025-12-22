const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const customerController = require('../controllers/customerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Apply Auth Middleware (Admin only for now)
// Apply Auth Middleware
// Open to Admin, Manager, and Insurance Agents
router.use(requireAuth);
router.use(requireRole('admin', 'manager', 'insurance_agent'));

// --- DASHBOARD ---
router.get('/stats', insuranceController.getDashboardStats);
router.get('/policy-counts', insuranceController.getPolicyCounts); // New
router.get('/analytics', insuranceController.getAnalytics);

// --- POLICIES ---
router.get('/policies', insuranceController.getPolicies);
router.post('/policies', insuranceController.createPolicy);
router.patch('/policies/:id', insuranceController.updatePolicy);
router.delete('/policies/:id', insuranceController.deletePolicy);

// Workflows
router.post('/policies/:id/renew', insuranceController.renewPolicy);
router.post('/policies/:id/lost', insuranceController.markLost);
router.post('/policies/:id/action', insuranceController.logWorkflowAction); // Deprecated
router.post('/policies/:id/interaction', insuranceController.addInteraction); // New Standard

// --- CUSTOMERS (Helper routes for the CRM) ---
router.get('/customers/search', customerController.searchCustomers);
router.post('/customers', customerController.createCustomer);
router.get('/customers/:id', customerController.getCustomerDetails);
router.patch('/customers/:id', customerController.updateCustomer);

// --- INTERACTIONS ---
router.post('/interactions', insuranceController.addInteraction); // Legacy endpoint, alias
router.get('/interactions/:customerId', insuranceController.getInteractions);

// --- BULK IMPORT ---
// Restricted to Admin/Manager only
router.post('/import', (req, res, next) => {
    // Only Admin/Manager can import
    if (['admin', 'manager'].includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
}, insuranceController.importPolicies);

module.exports = router;
