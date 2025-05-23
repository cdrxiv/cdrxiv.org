import { NextRequest, NextResponse } from 'next/server'

import { withAuthAndTokenRefresh } from './utils/auth'

const AUTHED_ROUTES = [
  '/submissions',
  '/preview',
  '/submit/overview',
  '/submit/info',
  '/submit/authors',
  '/submit/confirm',
]

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname === '/home.html') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (AUTHED_ROUTES.includes(request.nextUrl.pathname)) {
    return withAuthAndTokenRefresh(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|proxy/api/event|js|_next/static|_next/image|images|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
}
