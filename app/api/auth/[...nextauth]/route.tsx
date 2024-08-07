import NextAuth, { User } from 'next-auth'
import type { Provider } from 'next-auth/providers/index'

const Janeway: Provider = {
  id: 'janeway',
  name: 'Janeway',
  type: 'oauth',
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorization: {
    url: 'https://carbonplan.endurance.janeway.systems/carbonplan/o/authorize/',
    params: { scope: undefined },
  },
  token: 'https://carbonplan.endurance.janeway.systems/carbonplan/o/token/',
  userinfo: {
    url: 'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_info/',
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
      is_active: profile.is_active,
    }
  },
}

const handler = NextAuth({
  providers: [Janeway],
  pages: {
    signIn: '/submit/login',
    error: '/',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Refresh token logic adapted from from https://authjs.dev/guides/refresh-token-rotation?_gl=1*116ih1f*_gcl_au*NDA1OTU5Mzg1LjE3MjEyMzMwMzguNDQ4ODcyNDc2LjE3MjEzMzM1OTkuMTcyMTMzNTY2NQ..

      if (account) {
        // First login, save the `user`, `access_token`, `refresh_token`, and other details into the JWT
        return {
          ...token,
          user,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at as number,
        }
      } else if (Date.now() < (token.expiresAt as number) * 1000) {
        // Subsequent logins, if the `access_token` is still valid, return the JWT
        return token
      } else {
        // Subsequent logins, if the `access_token` has expired, try to refresh it
        if (!token.refreshToken) throw new Error('Missing refresh token')

        try {
          const response = await fetch(
            'https://carbonplan.endurance.janeway.systems/carbonplan/o/token/',
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                client_id: process.env.AUTH_CLIENT_ID as string,
                client_secret: process.env.AUTH_CLIENT_SECRET as string,
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken as string,
              }),
              method: 'POST',
            },
          )

          const responseTokens = await response.json()

          if (!response.ok) throw responseTokens

          return {
            // Keep the previous token properties
            ...token,
            accessToken: responseTokens.access_token as string,
            expiresAt: Math.floor(
              Date.now() / 1000 + (responseTokens.expires_in as number),
            ),
            // Fall back to old refresh token, but note that many providers may only allow using a refresh token once.
            refreshToken:
              (responseTokens.refresh_token as string) ??
              (token.refresh_token as string),
          }
        } catch (error) {
          console.error('Error refreshing access token', error)
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const }
        }
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
})
export { handler as GET, handler as POST }
