import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Redirect www to non-www (restaurantpack.se is already indexed without www)
  if (host === 'www.restaurantpack.se' || host.startsWith('www.restaurantpack.se:')) {
    const url = request.nextUrl.clone();
    url.host = 'restaurantpack.se';
    return NextResponse.redirect(url, 301); // 301 = Permanent redirect for SEO
  }

  // Redirect old domain to new domain (if any old traffic)
  if (host.includes('ideallivs.com') || host.includes('yourgrocerystore.com')) {
    const url = request.nextUrl.clone();
    url.host = 'restaurantpack.se';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
