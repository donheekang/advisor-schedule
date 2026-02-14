import type { MetadataRoute } from 'next';

import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pethealthplus.kr';
  const posts = await getAllBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${baseUrl}/cost-search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/pet-talker`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...staticRoutes, ...blogRoutes];
}
