import mongoose, { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  wp_id: Number,
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  content_text: String,
  video_url: String,
  thumbnail: String,
  categories: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    slug: String
  }],
  category_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  menu_order: { type: Number, default: 0 },
  published_at: Date,
  seo: {
    meta_title: String,
    meta_description: String
  }
}, { timestamps: true });

// Index for faster searching and sorting
PostSchema.index({ published_at: -1 });

export const Post = models.Post || model('Post', PostSchema);
