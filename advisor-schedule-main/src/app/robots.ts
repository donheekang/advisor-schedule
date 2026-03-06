import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: ['https://pethealthplus.kr/sitemap.xml'],
    host: 'https://pethealthplus.kr'
  };
}
