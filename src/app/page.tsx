import { getAllPosts } from "@/lib/api";
import PostGrid from "@/components/PostGrid";
import Script from "next/script";

export const revalidate = 3600; // ISR every hour

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { posts, pages: totalPages } = await getAllPosts(currentPage, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Código Fluente',
            url: 'https://www.codigofluente.com.br',
            description: 'Cursos gratuitos de programação, DevOps, IA e Data Science em português.',
            inLanguage: 'pt-BR',
            author: {
              '@type': 'Person',
              name: 'Toti Cavalcanti',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.codigofluente.com.br/?s={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Aulas Recentes<span className="text-neon-pink">.</span>
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Explore as últimas aulas publicadas sobre programação, infraestrutura, data science e inteligência artificial.
        </p>
      </header>

      <PostGrid 
        posts={posts} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl="/"
      />
    </div>
  );
}
