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

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes (TODO: Add authentication middleware)
router.post('/', createBlog);
router.get('/admin/all', getAllBlogsAdmin);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
