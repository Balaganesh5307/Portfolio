import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  iconName: { type: String, required: true }
}, {
  timestamps: true
});

const Highlight = mongoose.model('Highlight', highlightSchema);
export default Highlight;
