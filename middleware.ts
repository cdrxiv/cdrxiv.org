import { withAuth } from 'next-auth/middleware'

export const middleware = withAuth({
  pages: {
    signIn: '/submit/login',
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
