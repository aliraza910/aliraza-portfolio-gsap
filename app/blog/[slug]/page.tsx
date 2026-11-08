import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getPostBySlug, getRelatedPosts, getAdjacentPosts, getSiteSettings } from '@/lib/payload/client';
import { PostMeta } from '@/components/blog/PostMeta';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { RichText } from '@/components/rich-text/RichText';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30; // 30 seconds ISR

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalDomain || 'https://aliiraza.icu';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const authorName = settings.authorName || 'Ali Raza';

  return {
    title,
    description,
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: postUrl,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [authorName],
      tags: post.tags?.map((t: any) => (t && typeof t === 'object' ? t.name : t)).filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();

  const [post, settings] = await Promise.all([
    getPostBySlug(slug, { draft: isDraft }),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  // Fetch related articles and adjacent navigation concurrently with lightweight queries
  const [relatedPosts, { prevPost, nextPost }] = await Promise.all([
    getRelatedPosts(post, 3),
    getAdjacentPosts(post),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalDomain || 'https://aliiraza.icu';
  const authorName = settings.authorName || 'Ali Raza';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isDraft && (
        <div className="mb-6 p-3 border border-border text-xs font-mono flex items-center justify-between text-secondary">
          <span>Draft Mode Active (Payload CMS revision preview).</span>
          <a href="/api/disable-draft" className="underline hover:text-foreground">
            exit preview
          </a>
        </div>
      )}

      <article className="max-w-content space-y-6">
        <div>
          <Link
            href="/blog"
            className="text-xs text-muted hover:text-foreground no-underline font-mono"
          >
            ← writing
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-2 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>

          <p className="text-sm text-secondary leading-relaxed">
            {post.description}
          </p>

          <PostMeta post={post} />
        </header>

        {/* Table of Contents */}
        <TableOfContents content={post.content} />

        {/* Main Content */}
        <div className="py-2 text-foreground">
          <RichText content={post.content} />
        </div>

        {/* Prev / Next Navigation */}
        {(prevPost || nextPost) && (
          <nav
            aria-label="Article navigation"
            className="pt-6 mt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono"
          >
            {prevPost ? (
              <div className="space-y-1">
                <span className="text-muted block">← previous</span>
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {prevPost.title}
                </Link>
              </div>
            ) : (
              <div />
            )}

            {nextPost && (
              <div className="space-y-1 sm:text-right">
                <span className="text-muted block">next →</span>
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {nextPost.title}
                </Link>
              </div>
            )}
          </nav>
        )}

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-6 border-t border-border space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Related
            </span>
            <ul className="space-y-1 pl-4 list-disc text-sm">
              {relatedPosts.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="text-foreground hover:underline font-medium"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
