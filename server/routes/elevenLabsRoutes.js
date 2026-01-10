const express = require('express');
const router = express.Router();
const elevenLabsController = require('../controllers/elevenLabsController');

// POST /api/elevenlabs/webhook/transcript
router.post('/webhook/transcript', elevenLabsController.handleTranscriptWebhook);

module.exports = router;
