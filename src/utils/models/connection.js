// /src/utils/models/Connection.js
import mongoose from 'mongoose';

const ConnectionSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  connected_user_email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);
