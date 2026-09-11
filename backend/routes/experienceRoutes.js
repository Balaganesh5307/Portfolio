import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import adminAuth from '../middleware/adminAuth.js';
import * as db from '../services/supabaseData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for experience certificate uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/experiences');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `exp-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (PNG, JPG, WebP) and PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get all experiences
// @route   GET /api/experience
router.get('/', async (req, res) => {
  try {
    const experiences = await db.getExperience();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all experiences (admin view)
// @route   GET /api/experience/admin/all
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const experiences = await db.getExperience();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new experience
// @route   POST /api/experience/admin/create
router.post('/admin/create', adminAuth, upload.single('certificate'), async (req, res) => {
  try {
    const { startDate, endDate, role, title, company, description, period, technologies } = req.body;
    
    let certificatePath = '';
    let certificateName = '';

    if (req.file) {
      certificatePath = `/uploads/experiences/${req.file.filename}`;
      certificateName = req.file.originalname;
    } else if (req.body.certificatePath) {
      certificatePath = req.body.certificatePath;
      certificateName = req.body.certificateName || 'manual-certificate.pdf';
    }

    const expPeriod = period || (startDate ? `${startDate} - ${endDate || 'Present'}` : 'Present');
    const expTitle = title || role || 'Software Developer';

    const saved = await db.createExperience({
      title: expTitle,
      company: company || 'Company',
      period: expPeriod,
      description: description || '',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()) : []),
      certificatePath,
      certificateName
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update experience
// @route   PUT /api/experience/admin/:id
router.put('/admin/:id', adminAuth, upload.single('certificate'), async (req, res) => {
  try {
    const { startDate, endDate, role, title, company, description, period, technologies } = req.body;

    const payload = {};
    if (title || role) payload.title = title || role;
    if (company) payload.company = company;
    if (description) payload.description = description;
    if (period) payload.period = period;
    else if (startDate) payload.period = `${startDate} - ${endDate || 'Present'}`;
    if (technologies) {
      payload.technologies = Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim());
    }

    if (req.file) {
      payload.certificatePath = `/uploads/experiences/${req.file.filename}`;
      payload.certificateName = req.file.originalname;
    } else if (req.body.certificatePath) {
      payload.certificatePath = req.body.certificatePath;
      payload.certificateName = req.body.certificateName || 'manual-certificate.pdf';
    }

    const updated = await db.updateExperience(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: 'Experience not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete experience
// @route   DELETE /api/experience/admin/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await db.deleteExperience(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
