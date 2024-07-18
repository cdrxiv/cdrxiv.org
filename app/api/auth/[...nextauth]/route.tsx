import NextAuth from 'next-auth'
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
    request: async () => {
      return { id: 'foo', pk: 'bar' }
    },
  },
  checks: ['pkce'],
  profile(profile) {
    return {
      id: profile.pk,
      email: profile.email,
      first_name: profile.first_name,
      middle_name: profile.middle_name,
      last_name: profile.last_name,
      orcid: profile.last_name,
    }
  },
}

const handler = NextAuth({
  providers: [Janeway],
  pages: {
    error: '/',
  },
})

export { handler as GET, handler as POST }
