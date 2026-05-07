import { getPostBySlug, getRelatedPosts, getNeighborPosts } from "@/lib/api";
import VideoEmbed from "@/components/VideoEmbed";
import PostContent from "@/components/PostContent";
import PostCard from "@/components/PostCard";
import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import { Post } from "@/models/Post";
import Link from "next/link";
import DisqusComments from "@/components/DisqusComments";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Props {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params;
  const post = await getPostBySlug(postSlug);
  
  if (!post) return { title: 'Aula não encontrada' };

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


export default async function PostPage({ params }: Props) {
  const { postSlug } = await params;
  const post = await getPostBySlug(postSlug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Aula não encontrada</h1>
      </div>
    );
  }

  const relatedPosts = await getRelatedPosts(
    post._id, 
    post.category_ids, 
    4
  );

  const { prev, next } = await getNeighborPosts(
    post.published_at,
    post.category_ids[0]
  );

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
            <Link href={`/${post.categories?.[0]?.slug}`} className="hover:text-neon-pink transition-colors">
              {post.categories?.[0]?.name}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-500">AULA</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
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
              href={`/${post.categories[0]?.slug}/${prev.slug}`}
              className="flex flex-col group max-w-[45%]"
            >
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-neon-cyan transition-colors">Aula Anterior</span>
              <span className="text-sm text-white font-medium line-clamp-1 group-hover:text-neon-cyan">← {prev.title}</span>
            </Link>
          ) : <div />}
          
          {next ? (
            <Link 
              href={`/${post.categories[0]?.slug}/${next.slug}`}
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

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
          {prev ? (
            <Link 
              href={`/${post.categories[0]?.slug}/${prev.slug}`}
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
              href={`/${post.categories[0]?.slug}/${next.slug}`}
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
            {post.categories.map((cat: any) => (
              <Link 
                key={cat._id}
                href={`/${cat.slug}`}
                className="bg-white/5 hover:bg-neon-pink/10 hover:text-neon-pink text-gray-400 text-xs px-3 py-1 rounded transition-colors"
              >
                #{cat.name}
              </Link>
            ))}
          </div>

          {/* Disqus Comments */}
          <div className="mt-20">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center">
              <span className="w-2 h-8 bg-neon-pink mr-4"></span>
              Comentários
            </h3>
            <DisqusComments 
              slug={post.slug} 
              title={post.title} 
            />
          </div>
        </footer>
      </article>

      {/* Related Posts */}
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
