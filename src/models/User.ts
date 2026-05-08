import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['superuser', 'admin'], required: true },
  name:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: null },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
