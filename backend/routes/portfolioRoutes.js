import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/logo');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueName = `logo-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});


const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/profile');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueName = `profile-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

import express from 'express';
import About from '../models/About.js';
import Highlight from '../models/Highlight.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Platform from '../models/Platform.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// ==================== PUBLIC GET ROUTES ====================

// @desc Get About details
router.get('/about', async (req, res) => {
  try {
    const about = await About.findOne();
    if (about) {
      res.json(about);
    } else {
      res.status(404).json({ message: 'About profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get highlights
router.get('/highlights', async (req, res) => {
  try {
    const highlights = await Highlight.find();
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ number: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get education
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get certifications
router.get('/certifications', async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get platforms
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN CRUD ROUTES ====================

// @desc Update or create About profile
router.put('/admin/about', adminAuth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      Object.assign(about, req.body);
      await about.save();
    } else {
      about = await About.create(req.body);
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- SKILLS ---
router.post('/admin/skills', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/skills/:id', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/skills/:id', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- PROJECTS ---
router.post('/admin/projects', adminAuth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/projects/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/projects/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- EDUCATION ---
router.post('/admin/education', adminAuth, async (req, res) => {
  try {
    const edu = await Education.create(req.body);
    res.status(201).json(edu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/education/:id', adminAuth, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) return res.status(404).json({ message: 'Education entry not found' });
    res.json(edu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/education/:id', adminAuth, async (req, res) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ message: 'Education entry not found' });
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- PLATFORMS ---
router.post('/admin/platforms', adminAuth, async (req, res) => {
  try {
    const platform = await Platform.create(req.body);
    res.status(201).json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/platforms/:id', adminAuth, async (req, res) => {
  try {
    const platform = await Platform.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!platform) return res.status(404).json({ message: 'Platform profile not found' });
    res.json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/platforms/:id', adminAuth, async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);
    if (!platform) return res.status(404).json({ message: 'Platform profile not found' });
    res.json({ message: 'Platform deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- HIGHLIGHTS ---
router.post('/admin/highlights', adminAuth, async (req, res) => {
  try {
    const highlight = await Highlight.create(req.body);
    res.status(201).json(highlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/highlights/:id', adminAuth, async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!highlight) return res.status(404).json({ message: 'Highlight not found' });
    res.json(highlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/highlights/:id', adminAuth, async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndDelete(req.params.id);
    if (!highlight) return res.status(404).json({ message: 'Highlight not found' });
    res.json({ message: 'Highlight deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc Upload and update website logo
router.post('/admin/logo', adminAuth, logoUpload.single('logo'), async (req, res) => {
  try {
    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/logo/${req.file.filename}`;
    } else if (req.body.logoUrl) {
      logoUrl = req.body.logoUrl;
    } else {
      return res.status(400).json({ message: 'No logo file uploaded or path provided' });
    }

    let about = await About.findOne();
    if (about) {
      about.logoUrl = logoUrl;
      about.signatureAvatar = logoUrl;
      await about.save();
    } else {
      about = await About.create({
        name: 'Balaganesh',
        highlightedName: 'P',
        title: 'Developer',
        summary: 'Portfolio',
        resumeUrl: '/resume.pdf',
        email: 'email@test.com',
        phone: '1234567890',
        location: 'Coimbatore',
        declarationText: 'Declaration',
        signatureName: 'Balaganesh P',
        signatureLocation: 'Coimbatore',
        signatureAvatar: logoUrl,
        logoUrl: logoUrl
      });
    }
    res.json({ message: 'Logo updated successfully', logoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc Upload and update profile photo
router.post('/admin/profile-image', adminAuth, profileUpload.single('profileImage'), async (req, res) => {
  try {
    let profileImage = '';
    if (req.file) {
      profileImage = `/uploads/profile/${req.file.filename}`;
    } else if (req.body.profileImage) {
      profileImage = req.body.profileImage;
    } else {
      return res.status(400).json({ message: 'No profile image file uploaded or path provided' });
    }

    let about = await About.findOne();
    if (about) {
      about.profileImage = profileImage;
      await about.save();
    } else {
      about = await About.create({
        name: 'Balaganesh',
        highlightedName: 'P',
        title: 'Developer',
        summary: 'Portfolio',
        resumeUrl: '/resume.pdf',
        email: 'email@test.com',
        phone: '1234567890',
        location: 'Coimbatore',
        declarationText: 'Declaration',
        signatureName: 'Balaganesh P',
        signatureLocation: 'Coimbatore',
        signatureAvatar: 'BG',
        profileImage: profileImage
      });
    }
    res.json({ message: 'Profile photo updated successfully', profileImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc Remove profile photo
router.delete('/admin/profile-image', adminAuth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      if (about.profileImage && about.profileImage.startsWith('/uploads/profile/')) {
        const filePath = path.join(__dirname, '..', about.profileImage);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        }
      }
      about.profileImage = '';
      await about.save();
    }
    res.json({ message: 'Profile photo removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
