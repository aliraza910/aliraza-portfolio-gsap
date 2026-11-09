import { cache } from 'react';
import { PaginatedDocs, Post, Project, Category, Tag, SiteSettings } from './types';

const CMS_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3001/api';
const API_TOKEN = process.env.PAYLOAD_API_TOKEN;

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
  draft?: boolean;
}

/**
 * Low-level safe fetch wrapper for Payload CMS REST API.
 * Never throws unhandled errors that crash the frontend.
 */
async function fetchPayload<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const url = `${CMS_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_TOKEN) {
    headers['Authorization'] = `users API-Key ${API_TOKEN}`;
  }

  // Handle draft preview authorization if draft is true
  if (options.draft && API_TOKEN) {
    headers['Authorization'] = `users API-Key ${API_TOKEN}`;
  }

  const isDev = process.env.NODE_ENV === 'development';
  // In dev mode, always bypass cache (0s / no-store) so newly published posts appear instantly.
  // In production, default to 30s ISR so fresh posts appear within 30 seconds.
  const revalidateTime = options.draft ? 0 : (options.revalidate ?? (isDev ? 0 : 30));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
      signal: controller.signal,
    };

    if (revalidateTime === 0) {
      fetchOptions.cache = 'no-store';
    } else {
      fetchOptions.next = {
        revalidate: revalidateTime,
        tags: options.tags,
      };
      if (options.cache) {
        fetchOptions.cache = options.cache;
      }
    }

    const res = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`[Payload API] ${endpoint} returned HTTP ${res.status}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err: any) {
    // If the CMS is offline, log a brief note and return null without breaking the app
    console.warn(`[Payload API] Unable to connect to ${url}: ${err.message || 'CMS unreachable'}`);
    return null;
  }
}

/**
 * Fetch published posts with pagination, sorting, and optional category/tag filters
 */
export async function getPosts(params: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  draft?: boolean;
} = {}): Promise<PaginatedDocs<Post>> {
  const { page = 1, limit = 10, category, tag, draft = false } = params;

  const queryParts: string[] = [
    `page=${page}`,
    `limit=${limit}`,
    `sort=-publishedAt,-createdAt`,
    `depth=2`,
  ];

  if (draft) {
    queryParts.push(`draft=true`);
  } else {
    // In Payload CMS with versions/drafts, published status is stored under `_status`
    queryParts.push(`where[_status][equals]=published`);
  }

  if (category) {
    queryParts.push(`where[or][0][category.slug][equals]=${encodeURIComponent(category)}&where[or][1][category.name][equals]=${encodeURIComponent(category)}`);
  }

  if (tag) {
    queryParts.push(`where[tags.slug][equals]=${encodeURIComponent(tag)}`);
  }

  const endpoint = `/posts?${queryParts.join('&')}`;
  let data = await fetchPayload<PaginatedDocs<Post>>(endpoint, {
    tags: ['posts', 'blog-index'],
    draft,
  });

  // Resilient fallback: If querying with `_status` returned 0 docs,
  // query /posts directly (Payload collection access control already restricts anonymous requests to published docs)
  if ((!data || !data.docs || data.docs.length === 0) && !draft) {
    const fallbackParts: string[] = [
      `page=${page}`,
      `limit=${limit}`,
      `sort=-publishedAt,-createdAt`,
      `depth=2`,
    ];
    if (category) {
      fallbackParts.push(`where[or][0][category.slug][equals]=${encodeURIComponent(category)}&where[or][1][category.name][equals]=${encodeURIComponent(category)}`);
    }
    if (tag) {
      fallbackParts.push(`where[tags.slug][equals]=${encodeURIComponent(tag)}`);
    }

    const fallbackEndpoint = `/posts?${fallbackParts.join('&')}`;
    const fallbackData = await fetchPayload<PaginatedDocs<Post>>(fallbackEndpoint, {
      tags: ['posts', 'blog-index-fallback'],
    });

    if (fallbackData && fallbackData.docs && fallbackData.docs.length > 0) {
      data = {
        ...fallbackData,
        docs: fallbackData.docs.filter((d: any) => d._status !== 'draft' && d.status !== 'draft'),
      };
    }
  }

  return (
    data || {
      docs: [],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  );
}

/**
 * Fetch a single post by its unique slug (de-duplicated across metadata and page body)
 */
export const getPostBySlug = cache(
  async (
    slug: string,
    options: { draft?: boolean } = {}
  ): Promise<Post | null> => {
    const { draft = false } = options;
    const draftQuery = draft ? '&draft=true' : '&where[_status][equals]=published';
    const endpoint = `/posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2${draftQuery}&limit=1`;

    let data = await fetchPayload<PaginatedDocs<Post>>(endpoint, {
      tags: ['posts', `post-${slug}`],
      draft,
    });

    // Resilient fallback only if CMS actually responded with 0 matching documents
    if (data && Array.isArray(data.docs) && data.docs.length === 0 && !draft) {
      const fallbackEndpoint = `/posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`;
      data = await fetchPayload<PaginatedDocs<Post>>(fallbackEndpoint, {
        tags: ['posts', `post-fallback-${slug}`],
      });
    }

    if (!data || !data.docs || data.docs.length === 0) {
      return null;
    }

    return data.docs[0];
  }
);

/**
 * Fetch latest posts (used for homepage and RSS)
 */
export async function getLatestPosts(limit = 5): Promise<Post[]> {
  const res = await getPosts({ page: 1, limit });
  return res.docs;
}

/**
 * Fetch featured posts
 */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const endpoint = `/posts?where[_status][equals]=published&where[featured][equals]=true&sort=-publishedAt,-createdAt&depth=2&limit=${limit}`;
  const data = await fetchPayload<PaginatedDocs<Post>>(endpoint, {
    tags: ['posts', 'featured-posts'],
  });
  return data?.docs || [];
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const data = await fetchPayload<PaginatedDocs<Category>>('/categories?limit=100&sort=name', {
    tags: ['categories'],
  });
  return data?.docs || [];
}

/**
 * Fetch all tags
 */
export async function getTags(): Promise<Tag[]> {
  const data = await fetchPayload<PaginatedDocs<Tag>>('/tags?limit=100&sort=name', {
    tags: ['tags'],
  });
  return data?.docs || [];
}

/**
 * Securely searches published posts using Payload CMS's native REST API.
 * Uses case-insensitive `contains` substring search across title, description, and slug.
 * Payload access control automatically guarantees only published posts are returned.
 */
export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  if (!query || typeof query !== 'string') return [];

  // Sanitize: strip control characters, regex metacharacters, and boundary brackets
  let sanitized = query
    .replace(/[\x00-\x1F\x7F]/g, '') // remove ASCII control characters
    .replace(/[\[\]{}"'\\;`$<>]/g, ' ') // strip bracket / injection / delimiter characters
    .trim();

  // Enforce boundary lengths: minimum 2 characters, maximum 80 characters
  if (sanitized.length < 2) return [];
  if (sanitized.length > 80) {
    sanitized = sanitized.substring(0, 80).trim();
  }

  // Cap limit between 1 and 20 to protect memory and backend throughput
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 20));
  const q = encodeURIComponent(sanitized);

  // Directly query Payload CMS REST API with case-insensitive contains on title, description, and slug
  const endpoint = `/posts?where[or][0][title][contains]=${q}&where[or][1][description][contains]=${q}&where[or][2][slug][contains]=${q}&depth=1&limit=${safeLimit}&sort=-publishedAt`;

  const data = await fetchPayload<PaginatedDocs<Post>>(endpoint, {
    tags: ['posts', `search-${sanitized}`],
    revalidate: 30,
  });

  return data?.docs || [];
}

/**
 * Fast adjacent prev/next article lookup with minimal depth=0 payload
 */
export async function getAdjacentPosts(currentPost: Post): Promise<{
  prevPost: { title: string; slug: string } | null;
  nextPost: { title: string; slug: string } | null;
}> {
  try {
    const pubDate = currentPost.publishedAt || currentPost.createdAt;
    if (!pubDate) return { prevPost: null, nextPost: null };

    const encodedDate = encodeURIComponent(pubDate);
    const [prevRes, nextRes] = await Promise.all([
      fetchPayload<PaginatedDocs<Post>>(
        `/posts?where[publishedAt][less_than]=${encodedDate}&sort=-publishedAt&limit=1&depth=0`
      ),
      fetchPayload<PaginatedDocs<Post>>(
        `/posts?where[publishedAt][greater_than]=${encodedDate}&sort=publishedAt&limit=1&depth=0`
      ),
    ]);

    const prev = prevRes?.docs?.[0];
    const next = nextRes?.docs?.[0];

    return {
      prevPost: prev && prev.slug !== currentPost.slug ? { title: prev.title, slug: prev.slug } : null,
      nextPost: next && next.slug !== currentPost.slug ? { title: next.title, slug: next.slug } : null,
    };
  } catch {
    return { prevPost: null, nextPost: null };
  }
}

/**
 * Fetch related posts based on category or tags
 */
export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
  const categorySlug =
    typeof currentPost.category === 'object' && currentPost.category
      ? currentPost.category.slug
      : null;

  if (!categorySlug) {
    const latest = await getLatestPosts(limit + 1);
    return latest.filter((p) => p.slug !== currentPost.slug).slice(0, limit);
  }

  const endpoint = `/posts?where[_status][equals]=published&where[category.slug][equals]=${categorySlug}&where[slug][not_equals]=${currentPost.slug}&depth=2&limit=${limit}`;
  const data = await fetchPayload<PaginatedDocs<Post>>(endpoint, {
    tags: ['posts', `related-${currentPost.slug}`],
  });

  return data?.docs || [];
}

/**
 * Fetch global site settings from Payload CMS (de-duplicated per request lifecycle)
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await fetchPayload<any>('/globals/site-settings', {
    tags: ['site-settings'],
  });

  if (data) {
    const combinedSocials: Array<{ platform: string; url: string }> = [];
    if (data.github) combinedSocials.push({ platform: 'GitHub', url: data.github });
    if (data.linkedin) combinedSocials.push({ platform: 'LinkedIn', url: data.linkedin });
    if (data.twitter) combinedSocials.push({ platform: 'X / Twitter', url: data.twitter });
    if (Array.isArray(data.socialLinks)) {
      data.socialLinks.forEach((item: any) => {
        if (item?.platform && item?.url) {
          if (!combinedSocials.some((s) => s.platform.toLowerCase() === item.platform.toLowerCase())) {
            combinedSocials.push({ platform: item.platform, url: item.url });
          }
        }
      });
    }

    return {
      siteTitle: data.defaultTitle || 'Ali Raza · Systems & Backend Engineer',
      authorName: data.authorName || 'Ali Raza',
      authorBio:
        data.authorBio ||
        'Backend and distributed systems engineer. Interested in high-throughput network services, databases, Linux internals, and reliable software.',
      authorAvatar: data.authorAvatar,
      authorEmail: data.authorEmail || 'prod.ali9100@gmail.com',
      contactEmail: data.authorEmail || 'prod.ali9100@gmail.com',
      authorWebsite: data.authorWebsite || 'https://aliiraza.icu',
      github: data.github || 'https://github.com/aliraza910',
      linkedin: data.linkedin || 'https://linkedin.com/in/aliraza910',
      twitter: data.twitter || 'https://x.com/aliiraza',
      socialLinks: combinedSocials.length > 0 ? combinedSocials : [
        { platform: 'GitHub', url: 'https://github.com/aliraza910' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/aliraza910' },
        { platform: 'X / Twitter', url: 'https://x.com/aliiraza' },
      ],
      defaultTitle: data.defaultTitle || 'Ali Raza · Systems & Backend Engineer',
      defaultDescription:
        data.defaultDescription ||
        'Technical articles, distributed systems experiments, Go programming tutorials, and software architecture insights.',
      defaultOgImage: data.defaultOgImage,
      defaultPostsPerPage: data.defaultPostsPerPage || 10,
      canonicalDomain: data.canonicalDomain || 'https://aliiraza.icu',
    };
  }

  return {
    siteTitle: 'Ali Raza · Systems & Backend Engineer',
    authorName: 'Ali Raza',
    authorBio:
      'Backend and distributed systems engineer. Interested in high-throughput network services, databases, Linux internals, and reliable software.',
    authorEmail: 'prod.ali9100@gmail.com',
    contactEmail: 'prod.ali9100@gmail.com',
    authorWebsite: 'https://aliiraza.icu',
    github: 'https://github.com/aliraza910',
    linkedin: 'https://linkedin.com/in/aliraza910',
    twitter: 'https://x.com/aliiraza',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/aliraza910' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/aliraza910' },
      { platform: 'X / Twitter', url: 'https://x.com/aliiraza' },
    ],
    defaultTitle: 'Ali Raza · Systems & Backend Engineer',
    defaultDescription:
      'Technical articles, distributed systems experiments, Go programming tutorials, and software architecture insights.',
    defaultPostsPerPage: 10,
    canonicalDomain: 'https://aliiraza.icu',
  };
});

/**
 * Fallback static projects list used when CMS is offline or unreachable
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'travel-cms',
    name: 'Travel CMS',
    slug: 'travel-cms',
    category: 'Web Applications',
    stack: 'Laravel, React, MySQL',
    description: 'Travel CMS is a comprehensive content management system for travel agencies.',
    highlights: [
      { highlight: 'Dynamic booking workflows and customized itinerary management.' },
      { highlight: 'Multi-tiered customer roles, agent commission management, and invoices.' },
    ],
    githubUrl: '#',
    featured: true,
    order: 0,
    _status: 'published',
  },
  {
    id: 'raft-kv',
    name: 'raft-kv',
    slug: 'raft-kv',
    category: 'Distributed Systems',
    stack: 'Go, Raft Protocol, gRPC, Protobuf',
    description:
      'A distributed fault-tolerant key-value store built in Go implementing the Raft consensus protocol. Designed to verify linearizable reads and atomic writes across cluster partitions.',
    highlights: [
      { highlight: 'Implements randomized leader election, heartbeats, and log replication.' },
      { highlight: 'Log compaction via memory snapshotting and streaming to slower nodes.' },
      { highlight: 'Includes a Jepsen-style fault injection test harness simulating network partitions.' },
    ],
    githubUrl: '#',
    featured: true,
    order: 1,
    _status: 'published',
  },
  {
    id: 'flow-queue',
    name: 'flow-queue',
    slug: 'flow-queue',
    category: 'Network & Queuing',
    stack: 'Go, Redis, TCP Sockets',
    description:
      'An asynchronous job scheduling and worker queue system focusing on predictable p99 message consumption latencies and reliable retry handling.',
    highlights: [
      { highlight: 'Delayed scheduling using Redis sorted sets (ZSET) for efficient epoch polling.' },
      { highlight: 'Automatic backpressure regulation when downstream consumers lag.' },
      { highlight: 'Dead-letter exchange (DLX) with full message payload inspection.' },
    ],
    githubUrl: '#',
    featured: true,
    order: 2,
    _status: 'published',
  },
  {
    id: 'sql-trace',
    name: 'sql-trace',
    slug: 'sql-trace',
    category: 'Developer Tooling',
    stack: 'TypeScript, Node.js, PostgreSQL',
    description:
      'A zero-dependency CLI utility that digests PostgreSQL EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) outputs and produces plain-text execution tree summaries.',
    highlights: [
      { highlight: 'Pinpoints cache misses, shared buffer spills, and unexpected sequential scans.' },
      { highlight: 'Renders ASCII plan trees optimized for terminal stdout and README embeds.' },
      { highlight: 'Rule-based hints for missing index coverage and bloated table statistics.' },
    ],
    githubUrl: '#',
    featured: false,
    order: 3,
    _status: 'published',
  },
  {
    id: 'tiny-http-router',
    name: 'tiny-http-router',
    slug: 'tiny-http-router',
    category: 'Web Protocols',
    stack: 'Go, Radix Tree, HTTP/1.1',
    description:
      'A high-performance zero-allocation HTTP request router using a compressed Radix Tree for path matching with parameterized and wildcard route support.',
    highlights: [
      { highlight: 'Zero heap allocations during URL matching and parameter extraction.' },
      { highlight: 'Standard net/http compatibility without breaking handler signatures.' },
      { highlight: 'Comprehensive benchmark suite comparing against httprouter and chi.' },
    ],
    githubUrl: '#',
    featured: false,
    order: 4,
    _status: 'published',
  },
  {
    id: 'lsm-engine',
    name: 'lsm-engine',
    slug: 'lsm-engine',
    category: 'Storage Engines',
    stack: 'Go, LSM Tree, WAL, Bloom Filters',
    description:
      'An educational Log-Structured Merge-tree storage engine implementing MemTables, Write-Ahead Logs, SSTables on disk, and sparse index lookups.',
    highlights: [
      { highlight: 'Concurrent skip-list MemTable with background flushing to Level 0 SSTables.' },
      { highlight: 'Counting Bloom filters to prevent disk seeks on missing keys.' },
      { highlight: 'Tiered compaction scheduler to minimize read and write amplification.' },
    ],
    githubUrl: '#',
    featured: true,
    order: 5,
    _status: 'published',
  },
];

/**
 * Normalizes project highlights so they can be rendered reliably whether returned
 * as an array of objects `{ highlight: string }` from Payload or strings from fallback.
 */
export function getProjectHighlights(project: Project): string[] {
  if (!project.highlights || !Array.isArray(project.highlights)) return [];
  return project.highlights
    .map((h) => (typeof h === 'string' ? h : h?.highlight))
    .filter((h): h is string => Boolean(h && h.trim()));
}

/**
 * Fetch projects from Payload CMS with fallback to static projects
 */
export async function getProjects(params: {
  featured?: boolean;
  limit?: number;
  draft?: boolean;
} = {}): Promise<Project[]> {
  const { featured, limit = 50, draft = false } = params;

  const queryParts: string[] = [
    `limit=${limit}`,
    `sort=order,createdAt`,
    `depth=1`,
  ];

  if (!draft) {
    queryParts.push('where[_status][equals]=published');
  }

  if (typeof featured === 'boolean') {
    queryParts.push(`where[featured][equals]=${featured}`);
  }

  const endpoint = `/projects?${queryParts.join('&')}`;
  const data = await fetchPayload<PaginatedDocs<Project>>(endpoint, {
    tags: ['projects', featured ? 'featured-projects' : 'all-projects'],
    draft,
  });

  if (data && Array.isArray(data.docs) && data.docs.length > 0) {
    return data.docs;
  }

  // Graceful fallback to static data if CMS is offline or collection is empty
  let fallback = FALLBACK_PROJECTS;
  if (typeof featured === 'boolean') {
    fallback = fallback.filter((p) => Boolean(p.featured) === featured);
  }
  return limit ? fallback.slice(0, limit) : fallback;
}

/**
 * Fetch a single project by slug
 */
export const getProjectBySlug = cache(
  async (slug: string, draft = false): Promise<Project | null> => {
    const endpoint = `/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`;
    const data = await fetchPayload<PaginatedDocs<Project>>(endpoint, {
      tags: ['projects', `project-${slug}`],
      draft,
    });

    if (data?.docs?.[0]) {
      return data.docs[0];
    }

    const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
    return fallback || null;
  }
);

/**
 * Transforms CMS media URLs to use the Next.js frontend proxy (`/media/...`)
 * so backend CMS origin is never exposed to public viewers.
 */
export function getProxiedMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('/media/')) return url;

  if (url.includes('/media/')) {
    const idx = url.indexOf('/media/');
    return url.substring(idx);
  }

  return url.startsWith('/') ? url : `/${url}`;
}
