import React from 'react';
import PostCard from './PostCard';
import Link from 'next/link';

interface PostGridProps {
  posts: any[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function PostGrid({ posts, currentPage, totalPages, baseUrl }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl text-gray-400 font-mono">Nenhuma aula encontrada nesta categoria.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-10">
          {currentPage > 1 && (
            <Link
              href={`${baseUrl}?page=${currentPage - 1}`}
              className="px-4 py-2 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 rounded transition-all"
            >
              Anterior
            </Link>
          )}
          
          <span className="text-gray-400 font-mono text-sm">
            Página {currentPage} de {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`${baseUrl}?page=${currentPage + 1}`}
              className="px-4 py-2 border border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10 rounded transition-all"
            >
              Próxima
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
