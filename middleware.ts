import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export const middleware = withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: '/submit/login',
    error: '/error',
  },
})

export const config = {
  matcher: [
    '/submit/overview',
    '/submit/info',
    '/submit/authors',
    '/submit/confirm',
  ],
}
