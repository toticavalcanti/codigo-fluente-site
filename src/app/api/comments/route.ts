import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Comment } from '@/models/Comment';
import { Lead } from '@/models/Lead';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const post_slug = searchParams.get('post_slug');

    if (!post_slug) {
      return NextResponse.json({ error: 'post_slug ausente' }, { status: 400 });
    }

    const comments = await Comment.find({ post_slug, approved: true }).sort({ created_at: 1 });
    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, content, post_slug } = body;

    if (!name || !email || !content || !post_slug) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // 1. Salvar comentário
    const comment = await Comment.create({
      name,
      email,
      content,
      post_slug,
      approved: false, // Aprovação manual
      ip
    });

    // 2. Também salvar em leads com source "comment"
    const existingLead = await Lead.findOne({ email, source: 'comment' });
    if (!existingLead) {
      await Lead.create({
        name,
        email,
        source: 'comment',
        post_slug,
        ip
      });
    }

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    console.error('Comment API Error:', error);
    return NextResponse.json({ error: 'Erro ao enviar comentário' }, { status: 500 });
  }
}
