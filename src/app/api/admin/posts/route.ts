import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { verifyToken } from '@/lib/auth';

// Helper to check authentication
async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cf-admin-token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 20;
    const skip = (page - 1) * limit;

    await dbConnect();

    const query = search 
      ? { title: { $regex: search, $options: 'i' } } 
      : {};

    const [posts, total] = await Promise.all([
      Post.find(query)
        .select('_id title slug category_ids published_at createdAt status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query)
    ]);

    return NextResponse.json({
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, youtube_id, category_ids, content, excerpt, thumbnail, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ message: 'Título e slug são obrigatórios' }, { status: 400 });
    }

    await dbConnect();

    // Check if slug is unique
    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: 'Este slug já está em uso' }, { status: 409 });
    }

    const newPost = new Post({
      title,
      slug,
      youtube_id,
      category_ids,
      content,
      excerpt,
      thumbnail,
      status: status || 'published',
      published_at: status === 'published' ? new Date() : null
    });

    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ message: 'Erro ao criar post' }, { status: 500 });
  }
}
