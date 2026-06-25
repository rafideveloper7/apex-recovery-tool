const Blog = require('../models/Blog');
const catchAsync = require('../utils/catchAsync');

const getAllBlogs = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== 'all' ? { category } : {};
  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, blogs });
});

const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

const createBlog = catchAsync(async (req, res) => {
  const { title, slug, excerpt, content, category, author, heroEmoji } = req.body;

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    category: category || 'all',
    author: author || 'Apex Recovery',
    heroEmoji: heroEmoji || '📰',
  });

  res.status(201).json({ success: true, blog });
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  Object.assign(blog, req.body);
  blog.updatedAt = Date.now();
  await blog.save();

  res.json({ success: true, blog });
});

const deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  res.json({ success: true, message: 'Blog deleted' });
});

module.exports = { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };