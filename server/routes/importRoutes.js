const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });
const { bulkImport } = require('../controllers/customerImportController');

// POST /api/import/bulk
router.post('/bulk', upload.single('file'), bulkImport);

module.exports = router;
