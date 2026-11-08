import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/payload/client';
import { formatDate } from '@/components/blog/PostMeta';
import { LordIcon } from '@/components/ui/LordIcon';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    'A human-readable architectural index of all pages and published engineering writings on Ali Raza portfolio.',
};

export default async function SitemapPage() {
  const postsData = await getPosts({ limit: 500 });
  const posts = postsData.docs;

  const corePages = [
    {
      path: '/',
      title: 'Home',
      desc: 'Personal introduction, systems engineering focus, selected projects, recent writing, and experience.',
    },
    {
      path: '/about',
      title: 'About',
      desc: 'Engineering background, distributed systems philosophy, mechanical sympathy, and core principles.',
    },
    {
      path: '/projects',
      title: 'Projects',
      desc: 'Selected implementations: raft-kv, flow-queue, sql-trace, tiny-http-router, and lsm-engine.',
    },
    {
      path: '/blog',
      title: 'Blogs',
      desc: 'Long-form technical publications on distributed protocols, database internals, and Linux systems.',
    },
    {
      path: '/learning',
      title: 'Current Learning',
      desc: 'Active research topics: io_uring, LSM compaction, TLA+ verification, and SQL isolation anomalies.',
    },
    {
      path: '/uses',
      title: 'Uses',
      desc: 'Workstation hardware, ThinkPad setup, Arch Linux Sway environment, and developer toolchain.',
    },
    {
      path: '/contact',
      title: 'Contact',
      desc: 'Direct email, GitHub, LinkedIn, X profiles, and messaging form.',
    },
    {
      path: '/search',
      title: 'Search',
      desc: 'Sanitized full-text search across all published technical articles and topics.',
    },
  ];

  return (
    <article className="space-y-10 max-w-content">
      {/* Header */}
      <header className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/fkdjnafc.json"
            trigger="hover"
            palette="search"
            size={26}
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sitemap
          </h1>
        </div>
        <p className="text-secondary text-base leading-relaxed">
          A human-readable directory of this engineering notebook, organized into core site
          pages, technical blog publications, and machine-readable XML feeds for search engines.
        </p>

        {/* Quick Anchor Navigation */}
        <div className="pt-2 flex items-center gap-4 text-xs font-mono text-muted">
          <span>Jump to:</span>
          <a href="#pages" className="text-foreground hover:underline">
            [1. Site Pages]
          </a>
          <a href="#articles" className="text-foreground hover:underline">
            [2. Post-Sitemap ({posts.length})]
          </a>
          <a href="#feeds" className="text-foreground hover:underline">
            [3. Machine Feeds]
          </a>
        </div>
      </header>

      {/* Section 1: Standard Site Pages */}
      <section id="pages" className="space-y-4 scroll-mt-12">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <LordIcon
            src="https://cdn.lordicon.com/qhgmphtg.json"
            trigger="hover"
            palette="code"
            size={20}
          />
          <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide">
            1. Site Pages (Standard Sitemap)
          </h2>
        </div>

        <ul className="space-y-3.5 pl-2">
          {corePages.map((page) => (
            <li key={page.path} className="space-y-0.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <Link
                  href={page.path}
                  className="font-medium text-foreground hover:underline text-base"
                >
                  {page.title}
                </Link>
                <span className="text-xs font-mono text-muted">
                  {page.path}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {page.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 2: Articles (Post-Sitemap) */}
      <section id="articles" className="space-y-4 pt-4 border-t border-border scroll-mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <LordIcon
              src="https://cdn.lordicon.com/wxnxiano.json"
              trigger="hover"
              palette="doc"
              size={20}
            />
            <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide">
              2. Technical Articles (Post-Sitemap)
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            {posts.length} {posts.length === 1 ? 'publication' : 'publications'}
          </span>
        </div>

        {posts.length > 0 ? (
          <ul className="space-y-4 pl-2">
            {posts.map((post) => {
              const category =
                typeof post.category === 'object' && post.category
                  ? post.category.name
                  : null;

              return (
                <li key={post.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium text-foreground hover:underline text-base"
                    >
                      {post.title}
                    </Link>
                    <span className="text-xs font-mono text-muted">
                      /blog/{post.slug}
                    </span>
                  </div>

                  <p className="text-sm text-secondary leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted pt-0.5">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    {category && <span>· category: {category}</span>}
                    {post.readingTime && (
                      <span>· {post.readingTime} min read</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm font-mono text-muted pl-2">
            New articles will appear here as they are published.
          </p>
        )}
      </section>

      {/* Section 3: Machine & Search Engine Feeds */}
      <section id="feeds" className="space-y-3 pt-4 border-t border-border scroll-mt-12">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <LordIcon
            src="https://cdn.lordicon.com/gsqxdxog.json"
            trigger="hover"
            palette="gear"
            size={20}
          />
          <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide">
            3. Machine Feeds (XML & RSS)
          </h2>
        </div>

        <p className="text-sm text-secondary">
          Raw structured feeds intended for web crawlers, search indexers, and RSS readers:
        </p>

        <ul className="space-y-2 text-xs font-mono pl-2">
          <li>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              /sitemap.xml
            </a>{' '}
            <span className="text-muted">— Standard site pages XML feed</span>
          </li>
          <li>
            <a
              href="/post-sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              /post-sitemap.xml
            </a>{' '}
            <span className="text-muted">— Published technical articles XML feed</span>
          </li>
          <li>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              /feed.xml
            </a>{' '}
            <span className="text-muted">— Full RSS 2.0 technical publication feed</span>
          </li>
        </ul>
      </section>
    </article>
  );
}
