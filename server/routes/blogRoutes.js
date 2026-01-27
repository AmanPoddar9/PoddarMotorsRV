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
router.post('/', requireAuth, requireRole('admin', 'blogs.manage'), createBlog);
router.get('/admin/all', requireAuth, requireRole('admin', 'blogs.manage'), getAllBlogsAdmin);
router.get('/:id', requireAuth, requireRole('admin', 'blogs.manage'), getBlogById);
router.put('/:id', requireAuth, requireRole('admin', 'blogs.manage'), updateBlog);
router.delete('/:id', requireAuth, requireRole('admin', 'blogs.manage'), deleteBlog);

const { generateTopics, generateBlogMetadata, generateBlogBody, generateBlogImage } = require('../controllers/blogGeneratorController');

// AI Generator Routes
router.post('/generate-topics', requireAuth, requireRole('admin', 'blogs.manage'), generateTopics);
router.post('/generate-metadata', requireAuth, requireRole('admin', 'blogs.manage'), generateBlogMetadata);
router.post('/generate-body', requireAuth, requireRole('admin', 'blogs.manage'), generateBlogBody);
router.post('/generate-image', requireAuth, requireRole('admin', 'blogs.manage'), generateBlogImage);

module.exports = router;
