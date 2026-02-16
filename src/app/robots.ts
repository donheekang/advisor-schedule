import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/mypage/']
    },
    sitemap: 'https://advisor-schedule-fawn.vercel.app/sitemap.xml'
  };
}
