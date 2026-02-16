import type { MetadataRoute } from 'next';

import { blogPosts } from '@/lib/blog-posts';
import { getPopularBreeds } from '@/lib/condition-tag-map';
import { getAllCategorySlugs } from '@/lib/fee-categories';
import { getAllGuides } from '@/lib/guides';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://advisor-schedule-fawn.vercel.app';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/cost-search`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pet-talker`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/premium`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/ai-care`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 }
  ];

  const categoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => ({
    url: `${baseUrl}/cost-search/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  const guides = await getAllGuides();
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75
  }));

  const breedPages: MetadataRoute.Sitemap = getPopularBreeds().map((breed) => ({
    url: `${baseUrl}/breeds/${encodeURIComponent(breed)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...staticPages, ...categoryPages, ...guidePages, ...breedPages, ...blogPages];
}
