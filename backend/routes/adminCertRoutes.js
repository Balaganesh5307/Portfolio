import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Certification from '../models/Certification.js';
import adminAuth from '../middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for certification uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/certifications');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `cert-${Date.now()}${path.extname(file.originalname)}`;
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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const router = express.Router();

// @desc    Upload a new certification
// @route   POST /api/admin/certifications
router.post('/', adminAuth, upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, provider, iconName } = req.body;
    const isPdf = req.file.mimetype === 'application/pdf';
    const filePath = `/uploads/certifications/${req.file.filename}`;

    const cert = new Certification({
      title: title || 'Untitled Certificate',
      provider: provider || 'Unknown',
      image: filePath,
      iconName: iconName || 'award',
      fileType: isPdf ? 'pdf' : 'image',
      filePath
    });

    const saved = await cert.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update certification metadata
// @route   PUT /api/admin/certifications/:id
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const { title, provider, iconName } = req.body;
    if (title !== undefined) cert.title = title;
    if (provider !== undefined) cert.provider = provider;
    if (iconName !== undefined) cert.iconName = iconName;

    const updated = await cert.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a certification
// @route   DELETE /api/admin/certifications/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    // Delete file from disk if it's an uploaded file
    if (cert.filePath) {
      const absPath = path.join(__dirname, '..', cert.filePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
