import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Category } from '@/models/Category';
import { getPostUrl } from '@/lib/api';

const BASE_URL = 'https://www.codigofluente.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const posts = await Post.find({ status: 'published' })
    .select('slug category_ids date')
    .lean() as Array<{ slug: string; category_ids: unknown[]; date: Date }>;

  const categories = await Category.find({ is_top_level: true })
    .select('slug')
    .lean() as Array<{ slug: string }>;

  const postUrls = await Promise.all(
    posts.map(async (post) => ({
      url: `${BASE_URL}${await getPostUrl(post.slug, post.category_ids)}`,
      lastModified: post.date ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  const categoryUrls = categories.map(c => ({
    url: `${BASE_URL}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...categoryUrls,
    ...postUrls,
  ];
}
