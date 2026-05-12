import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { verifyToken } from '@/lib/auth';

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cf-admin-token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData = { ...body };
    if (!updateData.date || new Date(updateData.date).getFullYear() < 1971) {
      updateData.date = new Date();
      updateData.published_at = new Date();
    }

    await dbConnect();

    // If slug is being updated, check for uniqueness
    if (updateData.slug) {
      const existing = await Post.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ message: 'Este slug já está em uso' }, { status: 409 });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao atualizar post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ message: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao excluir post' }, { status: 500 });
  }
}
