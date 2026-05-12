import React from 'react';
import PostForm from '@/components/admin/PostForm';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  
  await dbConnect();
  const post = await Post.findById(id).lean();

  if (!post) {
    notFound();
  }

  // Convert MongoDB doc to the format expected by the form
  const initialData = {
    _id: post._id.toString(),
    title: post.title || '',
    slug: post.slug || '',
    youtube_id: post.youtube_id || '',
    category_ids: post.category_ids?.map((cid: any) => cid.toString()) || [],
    content: post.content || '',
    excerpt: post.excerpt || '',
    thumbnail: post.thumbnail || '',
    status: (post.status as 'published' | 'draft') || 'published'
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold">Editar <span className="text-neon-cyan">Aula</span></h1>
        <p className="text-gray-400 mt-1 text-sm font-mono">{initialData.title}</p>
      </header>

      <PostForm initialData={initialData} />
    </div>
  );
}
