import express from 'express';
import Blog from '../models/Blog.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get all published blogs
// @route   GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;
    const filter = { status: 'published' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const blogs = await Blog.find(filter).sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
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
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all blogs (including drafts)
// @route   GET /api/admin/blogs
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
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

    const blog = new Blog({
      title,
      content,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      tags: tags || [],
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a blog
// @route   PUT /api/admin/blogs/:id
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (tags !== undefined) blog.tags = tags;
    if (status !== undefined) {
      blog.status = status;
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a blog
// @route   DELETE /api/admin/blogs/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle publish/draft
// @route   PUT /api/admin/blogs/:id/publish
router.put('/admin/:id/publish', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.status = blog.status === 'published' ? 'draft' : 'published';
    if (blog.status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
