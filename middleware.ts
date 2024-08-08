import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export const middleware = withAuth(
  function middleware(request: NextRequestWithAuth) {
    if (request.nextUrl.pathname === '/submit') {
      return NextResponse.redirect(new URL('/submit/overview', request.url))
    }
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/submit/login',
    },
  },
)

export const config = {
  matcher: [
    '/submit/overview',
    '/submit/info',
    '/submit/authors',
    '/submit/confirm',
  ],
}
