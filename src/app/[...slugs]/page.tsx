import { notFound } from 'next/navigation';
import { getPostBySlug, getCategoryBySlug, getPostsByCategory, getRelatedPosts, getNeighborPosts } from '@/lib/api';
import { cleanWordPressContent } from '@/lib/utils';
import VideoEmbed from "@/components/VideoEmbed";
import PostContent from "@/components/PostContent";
import PostCard from "@/components/PostCard";
import { Metadata } from "next";
import Link from "next/link";
import Comments from "@/components/Comments";
import PostLinksSection from "@/components/PostLinksSection";
import PostGrid from "@/components/PostGrid";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Props {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const lastSlug = slugs[slugs.length - 1];
  
  const post = await getPostBySlug(lastSlug);
  if (post) {
    return {
      title: post.seo?.meta_title || `${post.title} - Código Fluente`,
      description: post.seo?.meta_description || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.thumbnail ? [{ url: post.thumbnail }] : [],
      }
    };
  }

  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    return {
      title: `${category.name} - Código Fluente`,
      description: (category as any).description || `Aulas de ${category.name} no Código Fluente.`,
    };
  }

  return { title: 'Página não encontrada' };
}

export default async function DynamicPage({ params, searchParams }: Props) {
  const { slugs } = await params;
  const lastSlug = slugs[slugs.length - 1];
  const sParams = await searchParams;
  const currentPage = Number(sParams.page) || 1;

  // 1. Tentar como Post
  const post = await getPostBySlug(lastSlug);
  
  if (post) {
    const relatedPosts = await getRelatedPosts(post._id, post.category_ids, 4);
    
    // Vizinhos - usamos a primeira categoria como referência
    const { prev, next } = await getNeighborPosts(post.published_at, post.category_ids[0]);
    
    const date = new Date(post.published_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          <header className="mb-10">
            <div className="flex items-center space-x-2 text-neon-cyan text-sm mb-4 font-bold uppercase tracking-widest">
              {post.categories?.[0] && (
                <>
                  <Link href={`/${post.categories[0].slug}`} className="hover:text-neon-pink transition-colors">
                    {post.categories[0].name}
                  </Link>
                  <span className="text-gray-600">/</span>
                </>
              )}
              <span className="text-gray-500">AULA</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-500 text-sm font-mono">
              <time>{date}</time>
              <span className="mx-3">•</span>
              <span>Por Código Fluente</span>
            </div>
          </header>

          {post.video_url && (
            <div className="mb-12">
              <VideoEmbed url={post.video_url} />
            </div>
          )}

          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            {prev ? (
              <Link 
                href={prev.url}
                className="flex flex-col group max-w-[45%]"
              >
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-neon-cyan transition-colors">Aula Anterior</span>
                <span className="text-sm text-white font-medium line-clamp-1 group-hover:text-neon-cyan">← {prev.title}</span>
              </Link>
            ) : <div />}
            
            {next ? (
              <Link 
                href={next.url}
                className="flex flex-col items-end group text-right max-w-[45%]"
              >
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-neon-pink transition-colors">Próxima Aula</span>
                <span className="text-sm text-white font-medium line-clamp-1 group-hover:text-neon-pink">{next.title} →</span>
              </Link>
            ) : <div />}
          </div>

          <div className="bg-background-soft rounded-2xl">
            <PostContent content={post.content} />
          </div>

          <PostLinksSection />

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
            {prev ? (
              <Link 
                href={prev.url}
                className="flex items-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
              >
                <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Anterior</span>
                  <span className="text-sm text-white font-bold group-hover:text-neon-cyan">AULA {prev.title.match(/\d+/)?.[0] || ''}</span>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link 
                href={next.url}
                className="flex items-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Próxima</span>
                  <span className="text-sm text-white font-bold group-hover:text-neon-pink">AULA {next.title.match(/\d+/)?.[0] || ''}</span>
                </div>
                <svg className="w-5 h-5 ml-2 text-gray-400 group-hover:text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : <div />}
          </div>

          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2 mb-10">
              {post.categories.map((cat: { _id: string; name: string; slug: string }) => (
                <Link 
                  key={cat._id}
                  href={`/${cat.slug}`}
                  className="bg-white/5 hover:bg-neon-pink/10 hover:text-neon-pink text-gray-400 text-xs px-3 py-1 rounded transition-colors"
                >
                  #{cat.name}
                </Link>
              ))}
            </div>

            <Comments postSlug={post.slug} />
          </footer>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-24">
            <h3 className="text-2xl font-bold text-white mb-10 flex items-center">
              <span className="w-2 h-8 bg-neon-cyan mr-4"></span>
              Aulas Relacionadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rp: any) => (
                <PostCard key={rp._id} post={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 2. Tentar como Categoria
  const { posts, pages: totalPages, category } = await getPostsByCategory(lastSlug, currentPage, 12);
  
  if (category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center space-x-2 text-neon-cyan text-sm mb-4 font-bold uppercase tracking-widest">
            <span>Categoria</span>
            <span className="text-gray-600">/</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {category.name}<span className="text-neon-pink">_</span>
          </h1>
          {(() => {
            let cleanedDesc = category.description || '';
            // Remove títulos duplicados que repetem o nome da categoria
            cleanedDesc = cleanedDesc.replace(new RegExp(`<h[1-6][^>]*>\\s*${category.name}\\s*</h[1-6]>`, 'i'), '');
            // Limpeza geral e remoção de lixo
            cleanedDesc = cleanWordPressContent(cleanedDesc);
            cleanedDesc = cleanedDesc.replace(/Obrigado\s+e\s+bons\s+estudos\s*[:;]?\s*\)?/gi, '').trim();

            if (!cleanedDesc || cleanedDesc.length < 10) return null;

            return (
              <div 
                dangerouslySetInnerHTML={{ __html: cleanedDesc }} 
                className="text-gray-400 max-w-2xl mb-8 prose prose-invert prose-p:text-gray-400 prose-headings:text-white"
              />
            );
          })()}
        </header>

        <PostGrid 
          posts={posts} 
          currentPage={currentPage} 
          totalPages={totalPages} 
          baseUrl={`/${slugs.join('/')}`}
        />
      </div>
    );
  }

  notFound();
}
