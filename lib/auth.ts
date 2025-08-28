import { NextAuthOptions, User } from 'next-auth'
import type { Provider } from 'next-auth/providers/index'

const Janeway: Provider = {
  id: 'janeway',
  name: 'Janeway',
  type: 'oauth',
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorization: {
    url: `${process.env.NEXT_PUBLIC_JANEWAY_URL}/o/authorize/`,
    params: { scope: undefined },
  },
  token: `${process.env.NEXT_PUBLIC_JANEWAY_URL}/o/token/`,
  userinfo: {
    url: `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_info/`,
  },
  checks: ['pkce'],
  profile(response) {
    const profile = response.results[0]
    return {
      id: profile.pk,
      email: profile.email,
      first_name: profile.first_name,
      middle_name: profile.middle_name,
      last_name: profile.last_name,
      orcid: profile.orcid,
      institution: profile.institution,
      is_active: profile.is_active,
    }
  },
}

export const authOptions: NextAuthOptions = {
  providers: [Janeway],
  pages: {
    signIn: '/account',
    error: '/',
  },
  callbacks: {
    async jwt({ token, trigger, account, user, session }) {
      // Refresh token logic adapted from from https://authjs.dev/guides/refresh-token-rotation?_gl=1*116ih1f*_gcl_au*NDA1OTU5Mzg1LjE3MjEyMzMwMzguNDQ4ODcyNDc2LjE3MjEzMzM1OTkuMTcyMTMzNTY2NQ..

      // Handle manual update() calls triggered on user update
      if (trigger === 'update' && session.user) {
        return {
          ...token,
          user: session.user,
        }
      }
      if (account) {
        // First login, save the `user`, `access_token`, `refresh_token`, and other details into the JWT
        return {
          ...token,
          user: user as User, // AdapterUser is not used
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at as number,
        }
      } else {
        // Subsequent logins, return the JWT
        return token
      }
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        return {
          ...session,
          accessToken: token.accessToken,
          user: token.user ?? session.user,
        }
      }

      return session
    },
  },
}
