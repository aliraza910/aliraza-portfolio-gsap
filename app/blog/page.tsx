import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getCategories, getTags, getSiteSettings } from '@/lib/payload/client';
import { formatDate } from '@/components/blog/PostMeta';
import { LordIcon } from '@/components/ui/LordIcon';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const authorName = settings.authorName || 'Ali Raza';
  return {
    title: 'Writing',
    description: `Engineering deep dives, systems architecture, distributed protocols, and backend design by ${authorName}.`,
  };
}

export const revalidate = 30; // 30 seconds ISR

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const activeCategory = resolvedParams.category;
  const activeTag = resolvedParams.tag;

  const [settings, categories, postsData] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getPosts({
      page,
      limit: 15,
      category: activeCategory,
      tag: activeTag,
    }),
  ]);

  const { docs: posts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
    postsData;

  const hasFilter = !!(activeCategory || activeTag);

  // Collect and deduplicate categories from both Categories collection and published posts
  const categoryMap = new Map<string, { id?: string; name: string; slug: string }>();

  categories.forEach((cat) => {
    if (cat?.slug) {
      categoryMap.set(cat.slug.toLowerCase(), {
        id: cat.id,
        name: cat.name || cat.slug,
        slug: cat.slug,
      });
    }
  });

  posts.forEach((post) => {
    if (typeof post.category === 'object' && post.category?.slug) {
      const slugKey = post.category.slug.toLowerCase();
      if (!categoryMap.has(slugKey)) {
        categoryMap.set(slugKey, {
          id: post.category.id,
          name: post.category.name || post.category.slug,
          slug: post.category.slug,
        });
      }
    }
  });

  const availableCategories = Array.from(categoryMap.values());

  return (
    <div className="space-y-10 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground inline-flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/wxnxiano.json"
            trigger="hover"
            palette="doc"
            size={24}
          />
          <span>Writing</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted font-mono">
          Long-form technical articles, systems design notes, and code architecture.
        </p>
      </header>

      {/* Topics / Category Filter */}
      {availableCategories.length > 0 && (
        <section aria-label="Filter writings by topic" className="space-y-2.5 border-b border-border/70 pb-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase tracking-wider text-muted font-medium">
              Filter by topic
            </span>
            {hasFilter && (
              <Link
                href="/blog"
                className="text-secondary hover:text-foreground underline underline-offset-2 flex items-center gap-1"
              >
                <span>[reset filter ×]</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <Link
              href="/blog"
              className={`px-3 py-1.5 border transition-colors no-underline ${
                !activeCategory
                  ? 'border-foreground bg-foreground text-background font-semibold'
                  : 'border-border bg-background text-secondary hover:text-foreground hover:border-foreground/60'
              }`}
            >
              All
            </Link>

            {availableCategories.map((cat) => {
              const isSelected = activeCategory?.toLowerCase() === cat.slug.toLowerCase();
              return (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                  className={`px-3 py-1.5 border transition-colors no-underline ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-semibold'
                      : 'border-border bg-background text-secondary hover:text-foreground hover:border-foreground/60'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {hasFilter && activeCategory && (
            <div className="text-xs font-mono text-muted pt-1">
              Filtered by topic: <span className="text-foreground font-medium">"{activeCategory}"</span>
            </div>
          )}
        </section>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          <div className="space-y-5">
            {posts.map((post) => {
              const categoryObj =
                typeof post.category === 'object' && post.category
                  ? post.category
                  : null;
              const categoryLabel = categoryObj?.name || categoryObj?.slug || null;
              const categorySlug = categoryObj?.slug || null;

              return (
                <article key={post.id} className="space-y-1.5 border-b border-border/50 pb-4 last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium text-foreground hover:underline text-lg tracking-tight"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2.5 text-xs font-mono text-muted shrink-0 flex-wrap">
                      {categoryLabel && categorySlug && (
                        <Link
                          href={`/blog?category=${encodeURIComponent(categorySlug)}`}
                          className="hover:text-foreground underline underline-offset-2"
                        >
                          {categoryLabel}
                        </Link>
                      )}
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-secondary leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-8 space-y-2 text-sm text-secondary font-mono border border-dashed border-border p-5 text-center">
            <p>
              {hasFilter
                ? `No articles found under topic "${activeCategory}".`
                : 'No published articles found yet. Published articles from Payload CMS will appear here.'}
            </p>
            {hasFilter && (
              <Link
                href="/blog"
                className="text-foreground underline underline-offset-4 inline-block pt-1"
              >
                ← View all articles
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="pt-6 border-t border-border flex items-center justify-between text-xs sm:text-sm font-mono text-secondary"
        >
          <div>
            {hasPrevPage && prevPage ? (
              <Link
                href={`/blog?page=${prevPage}${activeCategory ? `&category=${activeCategory}` : ''}`}
                className="hover:text-foreground"
              >
                ← newer
              </Link>
            ) : (
              <span className="opacity-30">← newer</span>
            )}
          </div>

          <div className="text-muted">
            page {page} of {totalPages}
          </div>

          <div>
            {hasNextPage && nextPage ? (
              <Link
                href={`/blog?page=${nextPage}${activeCategory ? `&category=${activeCategory}` : ''}`}
                className="hover:text-foreground"
              >
                older →
              </Link>
            ) : (
              <span className="opacity-30">older →</span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
