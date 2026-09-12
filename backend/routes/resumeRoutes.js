import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import adminAuth from '../middleware/adminAuth.js';
import * as db from '../services/supabaseData.js';

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
  limits: { fileSize: 15 * 1024 * 1024 }
});

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @desc    Get active resume for download
// @route   GET /api/resume
router.get('/', async (req, res) => {
  try {
    const resumes = await db.getResumes();
    const resume = resumes[0];
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
    const resumes = await db.getResumes();
    const resume = resumes[0];
    if (resume && resume.fileUrl) {
      if (resume.fileUrl.startsWith('http://') || resume.fileUrl.startsWith('https://')) {
        return res.redirect(resume.fileUrl);
      }
      const cleanPath = resume.fileUrl.startsWith('/') ? resume.fileUrl.substring(1) : resume.fileUrl;
      const absolutePath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(absolutePath)) {
        return res.download(absolutePath, resume.originalName || 'BALAGANESH_Resume.pdf');
      }
    }

    // Fallback to About resumeUrl
    const about = await db.getAbout();
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
    const resumes = await db.getResumes();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload new resume version
// @route   POST /api/resume/admin/upload
router.post('/admin/upload', adminAuth, upload.single('resume'), async (req, res) => {
  try {
    let fileUrl = '';
    let originalName = '';
    let fileSize = 0;
    const version = req.body.version || '';

    if (req.file) {
      fileUrl = `/uploads/resumes/${req.file.filename}`;
      originalName = req.file.originalname;
      fileSize = req.file.size;
    } else if (req.body.fileUrl || req.body.filePath) {
      fileUrl = req.body.fileUrl || req.body.filePath;
      originalName = req.body.originalName || req.body.fileName || fileUrl.split('/').pop() || 'resume.pdf';
    } else {
      return res.status(400).json({ message: 'No file uploaded or manual path provided' });
    }

    const saved = await db.createResume({
      fileUrl,
      originalName,
      fileSize,
      version
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Set active resume version
// @route   PUT /api/resume/admin/:id/activate
router.put('/admin/:id/activate', adminAuth, async (req, res) => {
  try {
    const activated = await db.activateResume(req.params.id);
    res.json(activated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a resume version
// @route   DELETE /api/resume/admin/:id
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await db.deleteResume(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
