import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Redirect www to non-www (restaurantpack.se is already indexed without www)
  if (host === 'www.restaurantpack.se' || host.startsWith('www.restaurantpack.se:')) {
    const url = request.nextUrl.clone();
    url.host = 'restaurantpack.se';
    return NextResponse.redirect(url, 301);
  }

  // Redirect old domain to new domain (if any old traffic)
  if (host.includes('ideallivs.com') || host.includes('yourgrocerystore.com')) {
    const url = request.nextUrl.clone();
    url.host = 'restaurantpack.se';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // Let next-intl handle locale detection and routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, apple-icon.png (favicon/icon files)
     * - opengraph-image, twitter-image (social images)
     * - robots.txt, sitemap (SEO files)
     * - feed (RSS/XML feeds)
     * - google-* (Google feed files)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|opengraph-image|twitter-image|robots\\.txt|sitemap|feed|google-|admin|debug|stripe-diagnostics|test-feedback).*)',
  ],
};
