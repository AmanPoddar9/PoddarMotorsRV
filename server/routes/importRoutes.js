const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });
const { bulkImport, importChunk } = require('../controllers/customerImportController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Protect all routes in this file
router.use(requireAuth);
router.use(requireRole('admin'));

// POST /api/import/bulk
router.post('/bulk', upload.single('file'), bulkImport);

// POST /api/import/chunk (Client-side Chunking)
// Note: importChunk was required inline before, now imported at top for cleaner code
router.post('/chunk', importChunk);

module.exports = router;
