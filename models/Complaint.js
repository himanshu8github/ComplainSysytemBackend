
import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Product', 'Service', 'Support'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
