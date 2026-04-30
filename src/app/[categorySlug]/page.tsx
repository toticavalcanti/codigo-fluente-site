import { getPostsByCategory, getMenuCategories } from "@/lib/api";
import PostGrid from "@/components/PostGrid";
import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models/Category";

export const revalidate = 3600;

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const { category } = await getPostsByCategory(categorySlug);
  
  if (!category) return { title: 'Categoria não encontrada' };

  return {
    title: `${category.name} - Código Fluente`,
    description: category.description || `Aulas de ${category.name} no Código Fluente.`,
  };
}

export async function generateStaticParams() {
  await dbConnect();
  const categories = await Category.find({}, 'slug').lean();
  return categories.map((cat: any) => ({
    categorySlug: cat.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const sParams = await searchParams;
  const currentPage = Number(sParams.page) || 1;
  
  const { posts, totalPages, category } = await getPostsByCategory(categorySlug, currentPage, 12);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Categoria não encontrada</h1>
      </div>
    );
  }

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
        {category.description && (
          <p className="text-gray-400 max-w-2xl">{category.description}</p>
        )}
      </header>

      <PostGrid 
        posts={posts} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl={`/${categorySlug}`}
      />
    </div>
  );
}
