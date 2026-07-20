import mongoose from 'mongoose';

const quickInfoSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const aboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  highlightedName: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  aboutTextDesktop: [{ type: String }],
  aboutTextMobile: [{ type: String }],
  quickInfo: [quickInfoSchema],
  declarationText: { type: String, required: true },
  signatureName: { type: String, required: true },
  signatureLocation: { type: String, required: true },
  signatureAvatar: { type: String, required: true }
}, {
  timestamps: true
});

const About = mongoose.model('About', aboutSchema);
export default About;
