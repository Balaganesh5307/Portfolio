import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminCertRoutes from './routes/adminCertRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import analyticsMiddleware from './middleware/analytics.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Get dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static images from root Images directory
app.use('/Images', express.static(path.join(__dirname, '../Images')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Analytics middleware — track public API visits
app.use('/api', analyticsMiddleware);

// API Routes
app.use('/api', portfolioRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/certifications', adminCertRoutes);
app.use('/api/experience', experienceRoutes);

// Fallback error route
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Nodemon trigger comment
