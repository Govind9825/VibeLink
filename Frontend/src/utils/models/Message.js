// /src/utils/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.SentMessage || mongoose.model('SentMessage', MessageSchema);
