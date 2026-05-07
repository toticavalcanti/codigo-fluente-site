import { getAllPosts } from "@/lib/api";
import PostGrid from "@/components/PostGrid";

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
