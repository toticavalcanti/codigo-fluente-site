import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  wp_id: Number,
  name: String,
  slug: { type: String, unique: true },
  description: String,
  parent_mongo_id: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  parent_slug: { type: String, default: null },
  is_top_level: { type: Boolean, default: false },
  children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  post_count: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);
