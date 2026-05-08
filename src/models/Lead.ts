import mongoose, { Schema, model, models } from 'mongoose';

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, enum: ['popup', 'comment'], required: true },
  category: String,
  post_slug: String,
  ip: String
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: false } 
});

// Avoid duplicate emails for the same source to keep it simple as requested
LeadSchema.index({ email: 1, source: 1 });

export const Lead = models.Lead || model('Lead', LeadSchema);
