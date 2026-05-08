import dbConnect from './mongodb';
import { Category } from '@/models/Category';
import { Post } from '@/models/Post';
import { cleanWordPressContent } from './utils';

interface CategoryDoc {
  _id: unknown;
  slug: string;
  parent_slug?: string | null;
  is_top_level?: boolean;
}

export async function getCategoryPath(slug: string): Promise<string[]> {
  await dbConnect();
  const path: string[] = [];
  let current = slug;
  for (let i = 0; i < 5; i++) {
    const cat = await Category.findOne({ slug: current }).lean() as CategoryDoc | null;
    if (!cat) break;
    path.unshift(current);
    if (!cat.parent_slug) break;
    current = cat.parent_slug;
  }
  return path;
}

export async function getPostUrl(postSlug: string, categoryIds: unknown[]): Promise<string> {
  await dbConnect();
  const cats = await Category.find({ _id: { $in: categoryIds } }).lean() as CategoryDoc[];
  const deepest = cats
    .filter(c => c.parent_slug)
    .sort((a, b) => (a.parent_slug ?? '').localeCompare(b.parent_slug ?? ''));
  const primary = deepest[0] ?? cats[0];
  if (!primary) return `/${postSlug}`;
  const path = await getCategoryPath(primary.slug);
  return `/${path.join('/')}/${postSlug}`;
}


function extractVideo(content: string) {
  const ytMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return ytMatch ? `https://www.youtube.com/watch?v=${ytMatch[1]}` : null;
}

export async function getMenuCategories() {
  await dbConnect();
  
  // Buscar todas as categorias para construir a árvore em memória
  const allCategories = await Category.find({}).lean() as any[];

  // Roots são as categorias marcadas como top-level ou sem pai
  const roots = allCategories
    .filter(c => c.is_top_level || (!c.parent_slug && !c.parent_mongo_id))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const result = await Promise.all(roots.map(async root => {
    // Buscar filhos diretos
    const children = allCategories
      .filter(c => c.parent_slug === root.slug)
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    return {
      ...root,
      url: `/${root.slug}`,
      children: await Promise.all(children.map(async child => {
        // Buscar netos
        const grandchildren = allCategories
          .filter(c => c.parent_slug === child.slug)
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return {
          ...child,
          url: `/${root.slug}/${child.slug}`,
          children: grandchildren.map(gc => ({
            ...gc,
            url: `/${root.slug}/${child.slug}/${gc.slug}`
          }))
        };
      }))
    };
  }));

  return JSON.parse(JSON.stringify(result));
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

  const cleanedPosts = posts.map(post => ({
    ...post,
    excerpt: cleanWordPressContent(post.excerpt || ''),
    content: cleanWordPressContent(post.content || '')
  }));

  return {
    posts: JSON.parse(JSON.stringify(cleanedPosts)),
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

  const cleanedPosts = posts.map(post => ({
    ...post,
    excerpt: cleanWordPressContent(post.excerpt || ''),
    content: cleanWordPressContent(post.content || '')
  }));

  return {
    posts: JSON.parse(JSON.stringify(cleanedPosts)),
    total,
    pages: Math.ceil(total / limit),
    category: JSON.parse(JSON.stringify(category))
  };
}

export async function getPostBySlug(slug: string) {
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) return null;
  
  const cleanedPost = {
    ...post,
    excerpt: cleanWordPressContent(post.excerpt || ''),
    content: cleanWordPressContent(post.content || ''),
    video_url: post.video_url || extractVideo(post.content || '')
  };
  
  return JSON.parse(JSON.stringify(cleanedPost));
}

export async function getNeighborPosts(publishedAt: string, categoryId: string) {
  await dbConnect();
  const [prev, next] = await Promise.all([
    Post.findOne({
      category_ids: categoryId,
      published_at: { $lt: new Date(publishedAt) }
    })
      .sort({ published_at: -1 })
      .select('slug title category_ids')
      .lean(),
    Post.findOne({
      category_ids: categoryId,
      published_at: { $gt: new Date(publishedAt) }
    })
      .sort({ published_at: 1 })
      .select('slug title category_ids')
      .lean()
  ]);

  return {
    prev: prev ? {
      ...JSON.parse(JSON.stringify(prev)),
      url: await getPostUrl(prev.slug, prev.category_ids)
    } : null,
    next: next ? {
      ...JSON.parse(JSON.stringify(next)),
      url: await getPostUrl(next.slug, next.category_ids)
    } : null
  };
}

export async function getCategoryBySlug(slug: string) {
  await dbConnect();
  return Category.findOne({ slug }).lean();
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
