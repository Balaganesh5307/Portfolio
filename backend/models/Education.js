import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  date: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  details: { type: String, required: true }
}, {
  timestamps: true
});

const Education = mongoose.model('Education', educationSchema);
export default Education;
