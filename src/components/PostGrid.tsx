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

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 pt-16">
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            {currentPage > 1 ? (
              <Link
                href={`${baseUrl}?page=${currentPage - 1}`}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white hover:border-neon-cyan hover:text-neon-cyan rounded-md transition-all text-sm font-bold uppercase tracking-wider"
              >
                Anterior
              </Link>
            ) : (
              <span className="px-4 py-2 bg-white/5 border border-white/5 text-gray-600 rounded-md text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                Anterior
              </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {pageNumbers.map((page) => (
                <Link
                  key={page}
                  href={`${baseUrl}?page=${page}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-neon-cyan text-background shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={`${baseUrl}?page=${currentPage + 1}`}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white hover:border-neon-cyan hover:text-neon-cyan rounded-md transition-all text-sm font-bold uppercase tracking-wider"
              >
                Próximo
              </Link>
            ) : (
              <span className="px-4 py-2 bg-white/5 border border-white/5 text-gray-600 rounded-md text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                Próximo
              </span>
            )}
          </div>
          
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            Página {currentPage} de {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
