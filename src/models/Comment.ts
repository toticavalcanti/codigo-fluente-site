import mongoose, { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  post_slug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  approved: { type: Boolean, default: false },
  ip: String
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: false } 
});

export const Comment = models.Comment || model('Comment', CommentSchema);
