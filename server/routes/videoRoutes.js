const express = require('express');
const router = express.Router();
const { createVideo, getVideos, deleteVideo } = require('../controllers/videoController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', getVideos);

// Admin routes
router.post('/', requireAuth, requireRole('admin', 'videos.manage'), createVideo);
router.delete('/:id', requireAuth, requireRole('admin', 'videos.manage'), deleteVideo);

module.exports = router;
