import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { searchPosts } from '@/lib/payload/client';
import { formatDate } from '@/components/blog/PostMeta';
import { LordIcon } from '@/components/ui/LordIcon';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search technical articles, protocols, and engineering notes by Ali Raza.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const rawQuery = (resolvedParams.q || '').trim();
  const query = rawQuery.slice(0, 60);

  const isTooShort = query.length === 1;
  const results = query.length >= 2 ? await searchPosts(query) : [];

  return (
    <div className="space-y-10 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/fkdjnafc.json"
            trigger="hover"
            palette="search"
            size={26}
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Search
          </h1>
        </div>
        <p className="text-secondary text-base leading-relaxed">
          Search across published engineering articles, systems design breakdowns, and technical topics.
        </p>
      </header>

      {/* Hardened Search Form with Color Lordicon */}
      <form action="/search" method="GET" className="space-y-2">
        <div className="group flex items-center border border-border bg-background focus-within:border-foreground transition-colors px-3 py-1.5">
          <LordIcon
            src="https://cdn.lordicon.com/fkdjnafc.json"
            trigger="hover"
            palette="search"
            size={22}
            className="mr-2.5"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            maxLength={60}
            placeholder="Search keywords, consensus protocols, databases..."
            autoFocus
            className="w-full bg-transparent px-1 py-1.5 text-base text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-mono border-l border-border hover:bg-muted/10 text-foreground font-medium cursor-pointer"
          >
            search
          </button>
        </div>
      </form>

      {/* Validation Message */}
      {isTooShort && (
        <div className="p-3 border border-border bg-code-bg font-mono text-xs text-secondary">
          Please enter at least 2 characters to perform a search.
        </div>
      )}

      {/* Results */}
      <section className="space-y-4">
        {query.length >= 2 ? (
          <>
            <div className="text-xs sm:text-sm text-muted font-mono">
              found {results.length} {results.length === 1 ? 'match' : 'matches'} for &ldquo;{query}&rdquo;
            </div>

            {results.length > 0 ? (
              <div className="space-y-5">
                {results.map((post) => {
                  const category =
                    typeof post.category === 'object' && post.category
                      ? post.category.name
                      : null;

                  return (
                    <article key={post.id} className="space-y-1.5 border-b border-border/50 pb-4 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium text-foreground hover:underline text-lg"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-mono text-muted shrink-0">
                          {category && <span>{category} · </span>}
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-secondary leading-relaxed">
                        {post.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 border border-border text-sm text-secondary font-mono">
                No matching articles found for &ldquo;{query}&rdquo;.
              </div>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
}
