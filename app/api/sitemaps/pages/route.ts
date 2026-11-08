import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliiraza.icu';

  // General pages sitemap: all normal pages EXCEPT individual blog posts
  const generalPages = [
    { url: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.8' },
    { url: `${siteUrl}/projects`, changefreq: 'weekly', priority: '0.8' },
    { url: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { url: `${siteUrl}/uses`, changefreq: 'monthly', priority: '0.7' },
    { url: `${siteUrl}/learning`, changefreq: 'weekly', priority: '0.8' },
    { url: `${siteUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
    { url: `${siteUrl}/search`, changefreq: 'weekly', priority: '0.5' },
    { url: `${siteUrl}/sitemap`, changefreq: 'weekly', priority: '0.6' },
  ];

  const xmlEntries = generalPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- General Pages Sitemap (Excluding Blog Articles) -->
  ${xmlEntries}
</urlset>`;

  return new NextResponse(sitemapXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

