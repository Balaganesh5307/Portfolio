import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  role: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  certificatePath: { type: String, default: '' },
  certificateName: { type: String, default: '' }
}, {
  timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
