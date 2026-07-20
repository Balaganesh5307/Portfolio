import mongoose from 'mongoose';

const platformStatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  handle: { type: String, required: true },
  iconName: { type: String, required: true },
  stats: [platformStatSchema]
}, {
  timestamps: true
});

const Platform = mongoose.model('Platform', platformSchema);
export default Platform;
