import { NextResponse } from 'next/server';
import { getLatestPosts, getSiteSettings } from '@/lib/payload/client';

export const revalidate = 3600; // 1 hour ISR

export async function GET() {
  const [posts, settings] = await Promise.all([
    getLatestPosts(25),
    getSiteSettings(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalDomain || 'https://aliiraza.icu';
  const authorName = settings.authorName || 'Ali Raza';
  const feedTitle = escapeXml(settings.defaultTitle || `${authorName} — Technical Writing & Systems Engineering`);
  const feedDesc = escapeXml(settings.defaultDescription || 'Engineering notebook, distributed systems, network protocols, and backend architecture.');

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
      const escapedTitle = escapeXml(post.title);
      const escapedDesc = escapeXml(post.description);

      return `
    <item>
      <title>${escapedTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapedDesc}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedTitle}</title>
    <link>${siteUrl}</link>
    <description>${feedDesc}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
