import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import * as db from '../services/supabaseData.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get all published blogs
// @route   GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await db.getBlogs(true);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await db.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const blogs = await db.getBlogs(false);
    const blog = blogs.find(b => b.id === req.params.id);
    const newViews = (blog?.views || 0) + 1;
    const updated = await db.updateBlog(req.params.id, { views: newViews });
    res.json({ likes: updated.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all blogs (including drafts)
// @route   GET /api/admin/blogs
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const blogs = await db.getBlogs(false);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a blog
// @route   POST /api/admin/blogs
router.post('/admin/create', adminAuth, async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, status } = req.body;

    const saved = await db.createBlog({
      title,
      content,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      tags: tags || [],
      published: status === 'published'
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a blog
// @route   PUT /api/admin/blogs/:id
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, status } = req.body;
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (content !== undefined) payload.content = content;
    if (excerpt !== undefined) payload.excerpt = excerpt;
    if (coverImage !== undefined) payload.coverImage = coverImage;
    if (tags !== undefined) payload.tags = tags;
    if (status !== undefined) payload.published = status === 'published';

    const updated = await db.updateBlog(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a blog
// @route   DELETE /api/admin/blogs/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await db.deleteBlog(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle publish/draft
// @route   PUT /api/admin/blogs/:id/publish
router.put('/admin/:id/publish', adminAuth, async (req, res) => {
  try {
    const blogs = await db.getBlogs(false);
    const blog = blogs.find(b => b.id === req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const newPublished = !blog.published;
    const updated = await db.updateBlog(req.params.id, { published: newPublished });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
