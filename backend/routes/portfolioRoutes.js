import express from 'express';
import About from '../models/About.js';
import Highlight from '../models/Highlight.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Platform from '../models/Platform.js';

const router = express.Router();

// @desc    Get About details
// @route   GET /api/about
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

// @desc    Get highlights
// @route   GET /api/highlights
router.get('/highlights', async (req, res) => {
  try {
    const highlights = await Highlight.find();
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get skills
// @route   GET /api/skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get projects
// @route   GET /api/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ number: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get education
// @route   GET /api/education
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get certifications
// @route   GET /api/certifications
router.get('/certifications', async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get platforms
// @route   GET /api/platforms
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
