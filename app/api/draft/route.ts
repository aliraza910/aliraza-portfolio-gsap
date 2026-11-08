import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { getPostBySlug } from '@/lib/payload/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  const expectedSecret =
    process.env.PREVIEW_SECRET || 'ali-raza-preview-secret-key-2026';

  if (!secret || secret !== expectedSecret) {
    return new Response('Invalid preview authorization token', { status: 401 });
  }

  if (!slug) {
    return new Response('Missing article slug', { status: 400 });
  }

  // Fetch the article with draft flag to verify existence in Payload CMS
  const post = await getPostBySlug(slug, { draft: true });

  if (!post) {
    return new Response(`Article with slug "${slug}" not found in Payload CMS`, {
      status: 404,
    });
  }

  // Enable Next.js Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the article page
  const redirectUrl = new URL(`/blog/${post.slug}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

