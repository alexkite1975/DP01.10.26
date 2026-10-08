import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    // Primary authorized VIP account specified by user:
    // angie.kite@me.com with password Morris01
    const isAngie = email === 'angie.kite@me.com' && password === 'Morris01';

    // Administrator & Developer fallback credentials
    const isAlexAdmin =
      (email === 'alex@drivepartners.app' ||
        email === 'admin@drivepartners.app' ||
        email === 'alexkite1975@gmail.com') &&
      (password === 'Morris01' || password === 'DP-ADMIN-2026');

    if (isAngie || isAlexAdmin) {
      const response = NextResponse.json({
        success: true,
        email,
        name: isAngie ? 'Angie Kite' : 'Alex Kite',
        role: 'colleague_preview',
        message: 'VIP Access Granted. Welcome to DrivePartners OS.'
      });

      // Set cookie for 30 days across all subpaths
      response.cookies.set('dp_preview_access', '1', {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        httpOnly: false // Allow client-side verification as well
      });

      response.cookies.set('dp_preview_user', email, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        httpOnly: false
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid colleague credentials. Please check your email and password.'
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Preview access locked. Returning to Coming Soon mode.'
  });

  response.cookies.set('dp_preview_access', '', {
    path: '/',
    maxAge: 0
  });

  response.cookies.set('dp_preview_user', '', {
    path: '/',
    maxAge: 0
  });

  return response;
}
