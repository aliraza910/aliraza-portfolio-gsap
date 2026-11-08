import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const referer = request.headers.get('referer');
  const redirectUrl = referer ? new URL(referer) : new URL('/blog', request.url);

  return NextResponse.redirect(redirectUrl);
}

