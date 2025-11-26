const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
  getBlogById,
} = require('../controllers/blogController');

const { requireAuth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.post('/', requireAuth, requireRole('admin', 'blogEditor'), createBlog);
router.get('/admin/all', requireAuth, requireRole('admin', 'blogEditor'), getAllBlogsAdmin);
router.get('/:id', requireAuth, requireRole('admin', 'blogEditor'), getBlogById);
router.put('/:id', requireAuth, requireRole('admin', 'blogEditor'), updateBlog);
router.delete('/:id', requireAuth, requireRole('admin', 'blogEditor'), deleteBlog);

module.exports = router;
