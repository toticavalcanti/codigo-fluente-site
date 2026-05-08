import React from 'react';
import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold">Nova <span className="text-neon-cyan">Aula</span></h1>
        <p className="text-gray-400 mt-1">Preencha os dados para publicar um novo conteúdo</p>
      </header>

      <PostForm />
    </div>
  );
}
