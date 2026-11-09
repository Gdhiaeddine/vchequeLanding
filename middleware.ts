import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vcheque-super-secret-key-fallback-32-bytes-minimum!'
);

const COOKIE_NAME = 'vcheque_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Convenience redirection: /login -> /admin/login
  if (pathname === '/login' || pathname.startsWith('/login/')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Intercept Admin routes
  if (pathname.startsWith('/admin')) {
    const isPublicAdminRoute =
      pathname === '/admin/login' ||
      pathname === '/admin/2fa' ||
      pathname === '/admin/2fa/setup' ||
      pathname.startsWith('/admin/auth');

    const token = request.cookies.get(COOKIE_NAME)?.value;
    let session: { userId: number; email: string; is2faVerified: boolean } | null = null;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        session = {
          userId: payload.userId as number,
          email: payload.email as string,
          is2faVerified: payload.is2faVerified as boolean,
        };
      } catch {
        session = null;
      }
    }

    // 1. Not logged in
    if (!session) {
      if (!isPublicAdminRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }

    // 2. Logged in, but 2FA is pending
    if (!session.is2faVerified) {
      if (pathname === '/admin/2fa' || pathname === '/admin/2fa/setup' || pathname === '/admin/login') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/admin/2fa', request.url));
    }

    // 3. Fully authenticated with 2FA
    if (pathname === '/admin/login' || pathname === '/admin/2fa') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login/:path*', '/login'],
};
