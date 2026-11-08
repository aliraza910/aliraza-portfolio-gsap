import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/payload/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const rawLimit = searchParams.get('limit') || '10';
    const limit = Math.max(1, Math.min(parseInt(rawLimit, 10) || 10, 20));

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        query,
        docs: [],
        totalDocs: 0,
      });
    }

    const docs = await searchPosts(query, limit);

    return NextResponse.json(
      {
        query,
        docs,
        totalDocs: docs.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('[Portfolio Search Route Error]:', error);
    return NextResponse.json(
      {
        error: 'Search request failed',
        message: error.message || 'Internal error',
      },
      { status: 500 }
    );
  }
}

