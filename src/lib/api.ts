import dbConnect from './mongodb';
import { Category } from '@/models/Category';
import { Post } from '@/models/Post';
import { cleanWordPressContent } from './utils';

interface CategoryDoc {
  _id: unknown;
  name: string;
  slug: string;
  parent_slug?: string | null;
  parent_mongo_id?: unknown;
  is_top_level?: boolean;
}

interface SiblingPost {
  slug: string;
  title: string;
  category_ids: unknown[];
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
  const allCategories = await Category.find({}).lean() as CategoryDoc[];

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
  const getSubcategoryIds = async (catId: unknown): Promise<unknown[]> => {
    const children = await Category.find({ parent_mongo_id: catId }).select('_id').lean();
    let ids: unknown[] = [catId];
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

export async function getPostBySlug(slug: string, preview = false) {
  await dbConnect();
  const query: { slug: string; status?: string } = { slug };
  if (!preview) {
    query.status = 'published';
  }
  const post = await Post.findOne(query).lean();
  if (!post) return null;
  
  const cleanedPost = {
    ...post,
    excerpt: cleanWordPressContent(post.excerpt || ''),
    content: cleanWordPressContent(post.content || ''),
    video_url: post.video_url || extractVideo(post.content || '')
  };
  
  return JSON.parse(JSON.stringify(cleanedPost));
}

export async function getNeighborPosts(postSlug: string, categoryIds: unknown[]) {
  await dbConnect();

  // Encontra a categoria mais específica (folha) do post
  const cats = await Category.find({ 
    _id: { $in: categoryIds } 
  }).lean() as CategoryDoc[];
  
  // Prefere categoria com parent_slug (mais específica)
  const leafCat = cats.find(c => c.parent_slug) ?? cats[0];
  if (!leafCat) return { prev: null, next: null };

  // Busca todos os posts publicados da mesma categoria
  const siblings = await Post.find({
    category_ids: leafCat._id,
    status: 'published',
  })
  .select('slug title category_ids')
  .lean() as SiblingPost[];

  function getLessonNumber(title: string): number {
    const match = title.match(/[Aa]ula\s+(\d+)/);
    return match ? parseInt(match[1], 10) : 9999;
  }

  // Busca o post atual sem filtro de status para obter seu número
  const currentPost = await Post.findOne({ slug: postSlug })
    .select('title').lean() as { title: string } | null;
  
  if (!currentPost) return { prev: null, next: null };

  const currentNumber = getLessonNumber(currentPost.title);

  // Ordena siblings por número
  siblings.sort((a, b) => getLessonNumber(a.title) - getLessonNumber(b.title));

  // Anterior = maior número que seja menor que o atual
  const prevPost = siblings
    .filter(p => getLessonNumber(p.title) < currentNumber)
    .at(-1) ?? null;

  // Próxima = menor número que seja maior que o atual
  const nextPost = siblings
    .find(p => getLessonNumber(p.title) > currentNumber) ?? null;

  const prevUrl = prevPost 
    ? await getPostUrl(prevPost.slug, prevPost.category_ids) 
    : null;
  const nextUrl = nextPost 
    ? await getPostUrl(nextPost.slug, nextPost.category_ids) 
    : null;

  return {
    prev: prevPost ? { ...prevPost, url: prevUrl } : null,
    next: nextPost ? { ...nextPost, url: nextUrl } : null,
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
