import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all platform routes directly without redirecting users away from the driver dashboard
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
