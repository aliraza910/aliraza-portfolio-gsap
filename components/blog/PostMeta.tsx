import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/payload/types';

interface PostMetaProps {
  post: Post;
  showCategory?: boolean;
  showTags?: boolean;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  } catch {
    return dateString;
  }
}

export function PostMeta({
  post,
  showCategory = true,
  showTags = false,
}: PostMetaProps) {
  const publishedDate = formatDate(post.publishedAt || post.createdAt);
  const category =
    typeof post.category === 'object' && post.category ? post.category : null;

  return (
    <div className="text-xs text-muted font-mono flex items-center gap-x-2 gap-y-1 flex-wrap">
      <time dateTime={post.publishedAt || post.createdAt}>{publishedDate}</time>

      {post.readingTime && (
        <>
          <span>·</span>
          <span>{post.readingTime} min</span>
        </>
      )}

      {showCategory && category && (
        <>
          <span>·</span>
          <Link
            href={`/blog?category=${category.slug}`}
            className="text-muted hover:text-foreground no-underline"
          >
            {category.slug}
          </Link>
        </>
      )}

      {showTags && post.tags && post.tags.length > 0 && (
        <>
          <span>·</span>
          <span className="text-muted">
            {post.tags
              .map((t: any) => (t && typeof t === 'object' ? t.slug : t))
              .filter(Boolean)
              .join(', ')}
          </span>
        </>
      )}
    </div>
  );
}
