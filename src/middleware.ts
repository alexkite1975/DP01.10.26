import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Next.js internal requests, static assets, and auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/vip-access') ||
    pathname.startsWith('/api/ai/radar') ||
    pathname === '/coming-soon' ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Check for VIP Colleague preview cookie
  const previewCookie = request.cookies.get('dp_preview_access');
  const isAuthenticated = previewCookie && previewCookie.value === '1';

  // 3. If unauthenticated, redirect to the Coming Soon page
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon';
    return NextResponse.redirect(url);
  }

  // 4. Authenticated colleagues get full access to everything
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
