import { withAuth } from 'next-auth/middleware'

export const middleware = withAuth({
  pages: {
    signIn: '/account',
  },
})

export const config = {
  matcher: [
    '/submissions',
    '/submit/overview',
    '/submit/info',
    '/submit/authors',
    '/submit/confirm',
  ],
}
