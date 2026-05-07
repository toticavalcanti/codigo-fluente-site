import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail?: string;
    categories: Array<{ name: string; slug: string }>;
    published_at: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const date = new Date(post.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const category = post.categories?.[0];
  const thumbnail = post.thumbnail || '/images/fallback-thumb.png';

  return (
    <Link href={`/${category?.slug || 'blog'}/${post.slug}`} className="group">
      <article className="h-full bg-background border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,45,120,0.2)] flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {category && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-neon-cyan text-xs font-bold uppercase tracking-tight px-2 py-1 rounded-sm">
              {category.name}
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <time className="text-xs text-gray-500 mb-2 block">{date}</time>
          <h3 className="text-lg font-bold text-gray-100 group-hover:text-neon-pink transition-colors line-clamp-2 mb-3">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="text-neon-cyan text-xs font-bold flex items-center group-hover:underline">
            LER AULA
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
