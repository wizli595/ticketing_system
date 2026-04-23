import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/tickets/new', '/tickets/my', '/orders'];
const PUBLIC_ROUTES = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user is authenticated
  const authToken = request.cookies.get('session')?.value;

  // Redirect to signin if accessing protected routes without auth
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing auth pages while authenticated
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
