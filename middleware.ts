import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { isFullSiteEnabled } from './utils/flags'
import { NextFetchEvent, NextResponse } from 'next/server'

const AUTHED_ROUTES = [
  '/submissions',
  '/preview',
  '/submit/overview',
  '/submit/info',
  '/submit/authors',
  '/submit/confirm',
]

const FULL_SITE_ROUTES = ['/search', '/preprint/']

const withAuthMiddleware = withAuth({
  pages: {
    signIn: '/account',
  },
})
export const middleware = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => {
  if (request.nextUrl.pathname === '/home.html') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isFullSiteEnabled()) {
    if (AUTHED_ROUTES.includes(request.nextUrl.pathname)) {
      return withAuthMiddleware(request, event)
    } else {
      return NextResponse.next()
    }
  }

  if (
    FULL_SITE_ROUTES.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|proxy/api/event|js|_next/static|_next/image|images|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
}
