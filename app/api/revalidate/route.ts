import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const VALID_SECRETS = new Set(
  [
    process.env.REVALIDATION_SECRET,
    '3d1A34JeGTOFyeUPL7RO/9U2zruskuI6ctS6Ep+7c8s=',
    'x/u3AQ2mmyAcmHZ+TSvR+pV6dPMxW8W0SqZ//Gkz6U4=',
    'ali-raza-revalidate-secret-token-2026',
  ].filter(Boolean) as string[]
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const secret =
      request.headers.get('x-revalidation-secret') ||
      bearerToken ||
      request.nextUrl.searchParams.get('secret') ||
      body.secret;

    if (!secret || !VALID_SECRETS.has(secret)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid secret' }, { status: 401 });
    }

    const collection = body.collection || '';
    const slug = body.slug || body.doc?.slug;
    const previousSlug = body.previousSlug;

    if (collection === 'projects') {
      revalidateTag('projects');
      revalidateTag('featured-projects');
      revalidateTag('all-projects');
      if (slug) revalidateTag(`project-${slug}`);
      if (previousSlug) revalidateTag(`project-${previousSlug}`);
      revalidatePath('/projects');
      revalidatePath('/');
    } else {
      // Posts / general revalidation
      revalidateTag('posts');
      revalidateTag('blog-index');
      revalidateTag('featured-posts');

      if (slug) {
        revalidateTag(`post-${slug}`);
        revalidateTag(`related-${slug}`);
        revalidatePath(`/blog/${slug}`);
      }

      if (previousSlug) {
        revalidateTag(`post-${previousSlug}`);
        revalidatePath(`/blog/${previousSlug}`);
      }

      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/sitemap.xml');
      revalidatePath('/feed.xml');
    }

    return NextResponse.json({
      revalidated: true,
      collection: collection || 'posts',
      slug: slug || 'all',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache', message: err.message },
      { status: 500 }
    );
  }
}

// Allow GET for easy manual trigger with ?secret=...
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!secret || !VALID_SECRETS.has(secret)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid secret' }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get('slug');
  const collection = request.nextUrl.searchParams.get('collection') || '';

  if (collection === 'projects') {
    revalidateTag('projects');
    revalidateTag('featured-projects');
    revalidatePath('/projects');
    revalidatePath('/');
  } else {
    revalidateTag('posts');
    revalidateTag('blog-index');
    revalidatePath('/');
    revalidatePath('/blog');
    if (slug) {
      revalidateTag(`post-${slug}`);
      revalidatePath(`/blog/${slug}`);
    }
  }

  return NextResponse.json({
    revalidated: true,
    collection: collection || 'posts',
    slug: slug || 'all',
    timestamp: Date.now(),
  });
}
