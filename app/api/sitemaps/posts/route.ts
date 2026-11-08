import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/payload/client';

export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliiraza.icu';
  const postsData = await getPosts({ limit: 500 });
  const posts = postsData.docs;

  const postsXml = posts
    .map((post) => {
      const lastMod = new Date(post.updatedAt || post.createdAt).toISOString();
      return `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Post Sitemap: Published Technical Blog Articles -->
  ${postsXml}
</urlset>`;

  return new NextResponse(sitemapXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

