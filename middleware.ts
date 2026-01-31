import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authRole = request.cookies.get('auth_role')?.value

  const protectedRoutes = ['/admin', '/nuevo', '/reportes'];

  if (protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (authRole !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirected', 'true');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/nuevo/:path*', '/reportes/:path*'],
}