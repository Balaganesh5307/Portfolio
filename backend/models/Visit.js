import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  page: { type: String, default: '/' },
  ip: { type: String, default: '' },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'Direct' },
  projectViewed: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient analytics queries
visitSchema.index({ createdAt: -1 });
visitSchema.index({ country: 1 });
visitSchema.index({ device: 1 });
visitSchema.index({ browser: 1 });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
