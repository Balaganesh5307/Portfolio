import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Experience from '../models/Experience.js';
import adminAuth from '../middleware/adminAuth.js';

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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get all experiences
// @route   GET /api/experience
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
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
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new experience
// @route   POST /api/experience/admin/create
router.post('/admin/create', adminAuth, upload.single('certificate'), async (req, res) => {
  try {
    const { startDate, endDate, role, company, description } = req.body;
    
    let certificatePath = '';
    let certificateName = '';

    if (req.file) {
      certificatePath = `/uploads/experiences/${req.file.filename}`;
      certificateName = req.file.originalname;
    }

    const exp = new Experience({
      startDate,
      endDate: endDate === 'Present' || !endDate ? null : endDate,
      role,
      company,
      description,
      certificatePath,
      certificateName
    });

    const saved = await exp.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update experience
// @route   PUT /api/experience/admin/:id
router.put('/admin/:id', adminAuth, upload.single('certificate'), async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const { startDate, endDate, role, company, description, deleteCertificate } = req.body;

    if (startDate !== undefined) exp.startDate = startDate;
    if (endDate !== undefined) {
      exp.endDate = endDate === 'Present' || !endDate ? null : endDate;
    }
    if (role !== undefined) exp.role = role;
    if (company !== undefined) exp.company = company;
    if (description !== undefined) exp.description = description;

    // Handle certificate file deletion requested by admin
    if (deleteCertificate === 'true' && exp.certificatePath) {
      const absPath = path.join(__dirname, '..', exp.certificatePath);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      exp.certificatePath = '';
      exp.certificateName = '';
    }

    // Handle new certificate file upload
    if (req.file) {
      // Delete old file first if exists
      if (exp.certificatePath) {
        const oldPath = path.join(__dirname, '..', exp.certificatePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      exp.certificatePath = `/uploads/experiences/${req.file.filename}`;
      exp.certificateName = req.file.originalname;
    }

    const updated = await exp.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete experience
// @route   DELETE /api/experience/admin/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Delete associated certificate file from disk
    if (exp.certificatePath) {
      const absPath = path.join(__dirname, '..', exp.certificatePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
