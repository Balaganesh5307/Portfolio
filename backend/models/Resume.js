import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  version: { type: String, required: true },
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
