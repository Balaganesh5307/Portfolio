import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  image: { type: String, required: true },
  iconName: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'pdf'], default: 'image' },
  filePath: { type: String, default: '' }
}, {
  timestamps: true
});

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
