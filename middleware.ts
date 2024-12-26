import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { trackPageView } from './lib/analytics';

export async function middleware(request: NextRequest) {
  // Track page view
  const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');
  
  await trackPageView(
    request.nextUrl.pathname,
    ip,
    userAgent || undefined
  );

  // Protection de la route admin/dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const hasAccess = request.cookies.has('admin_access');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};