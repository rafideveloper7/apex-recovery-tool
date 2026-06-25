const express = require('express');
const { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authMiddleware, adminMiddleware, createBlog);
router.put('/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;