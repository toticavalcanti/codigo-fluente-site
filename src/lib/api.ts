import dbConnect from './mongodb';
import { Category } from '@/models/Category';
import { Post } from '@/models/Post';

export async function getMenuCategories() {
  await dbConnect();
  // Get roots (parent_mongo_id is null) and populate children
  const roots = await Category.find({ parent_mongo_id: null })
    .populate({
      path: 'children',
      populate: { path: 'children' } // Support up to 2 levels deep as per hierarchy
    })
    .sort({ name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(roots));
}

export async function getAllPosts(page = 1, limit = 12) {
  await dbConnect();
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    Post.find({})
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({})
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    total,
    pages: Math.ceil(total / limit)
  };
}

export async function getPostsByCategory(slug: string, page = 1, limit = 12) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return { posts: [], total: 0, pages: 0, category: null };

  // Find all subcategories recursively
  const getSubcategoryIds = async (catId: any): Promise<any[]> => {
    const children = await Category.find({ parent_mongo_id: catId }).select('_id').lean();
    let ids = [catId];
    for (const child of children) {
      const childIds = await getSubcategoryIds(child._id);
      ids = [...ids, ...childIds];
    }
    return ids;
  };

  const categoryIds = await getSubcategoryIds(category._id);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ category_ids: { $in: categoryIds } })
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ category_ids: { $in: categoryIds } })
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    total,
    pages: Math.ceil(total / limit),
    category: JSON.parse(JSON.stringify(category))
  };
}

export async function getPostBySlug(slug: string) {
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function getRelatedPosts(postId: string, categoryIds: string[], limit = 4) {
  await dbConnect();
  const posts = await Post.find({
    _id: { $ne: postId },
    category_ids: { $in: categoryIds }
  })
    .sort({ published_at: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(posts));
}
