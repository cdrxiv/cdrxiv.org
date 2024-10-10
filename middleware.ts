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
const withAuthMiddleware = withAuth({
  pages: {
    signIn: '/account',
  },
})
export const middleware = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => {
  if (isFullSiteEnabled()) {
    if (AUTHED_ROUTES.includes(request.nextUrl.pathname)) {
      return withAuthMiddleware(request, event)
    } else if (request.nextUrl.pathname === '/home.html') {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.next()
    }
  }

  if (request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|proxy/api/event|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
}
