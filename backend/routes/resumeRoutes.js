import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Resume from '../models/Resume.js';
import About from '../models/About.js';
import adminAuth from '../middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `resume-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get active resume for download
// @route   GET /api/resume
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) {
      return res.status(404).json({ message: 'No active resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Download active resume file directly
// @route   GET /api/resume/download
router.get('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    if (resume) {
      if (resume.filePath.startsWith('http://') || resume.filePath.startsWith('https://')) {
        return res.redirect(resume.filePath);
      }
      const cleanPath = resume.filePath.startsWith('/') ? resume.filePath.substring(1) : resume.filePath;
      const absolutePath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(absolutePath)) {
        return res.download(absolutePath, resume.fileName || 'BALAGANESH_Resume.pdf');
      }
    }

    // Fallback to About resumeUrl
    const about = await About.findOne();
    if (about && about.resumeUrl && !about.resumeUrl.includes('drive.google.com')) {
      const cleanPath = about.resumeUrl.startsWith('/') ? about.resumeUrl.substring(1) : about.resumeUrl;
      const fallbackPath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(fallbackPath)) {
        return res.download(fallbackPath, 'BALAGANESH_Resume.pdf');
      }
    }

    res.status(404).json({ message: 'No active resume file found on server' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all resume versions
// @route   GET /api/admin/resumes
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload new resume version
// @route   POST /api/admin/resumes
router.post('/admin/upload', adminAuth, upload.single('resume'), async (req, res) => {
  try {
    let filePath = '';
    let fileName = '';

    if (req.file) {
      filePath = `/uploads/resumes/${req.file.filename}`;
      fileName = req.file.originalname;
    } else if (req.body.filePath) {
      filePath = req.body.filePath;
      fileName = req.body.fileName || 'manual-resume.pdf';
    } else {
      return res.status(400).json({ message: 'No file uploaded or manual path provided' });
    }

    const count = await Resume.countDocuments();
    const shouldBeActive = count === 0 || req.body.isActive === 'true' || req.body.isActive === true;

    if (shouldBeActive) {
      await Resume.updateMany({}, { isActive: false });
    }

    const { version } = req.body;
    const resume = new Resume({
      version: version || `v${Date.now()}`,
      filePath,
      fileName,
      isActive: shouldBeActive
    });

    const saved = await resume.save();

    if (shouldBeActive) {
      await About.updateMany({}, { resumeUrl: filePath });
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Set resume as active
// @route   PUT /api/admin/resumes/:id/activate
router.put('/admin/:id/activate', adminAuth, async (req, res) => {
  try {
    // Deactivate all resumes first
    await Resume.updateMany({}, { isActive: false });

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Sync active resume URL with About profile
    await About.updateMany({}, { resumeUrl: resume.filePath });

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a resume version
// @route   DELETE /api/admin/resumes/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete file from disk if it exists
    const filePath = path.join(__dirname, '..', resume.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
