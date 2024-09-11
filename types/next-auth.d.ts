import NextAuth, { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number
      first_name: string
      middle_name: string | null
      last_name: string
      orcid: string | null
      institution?: string | null
      is_active: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: number
    first_name: string
    middle_name: string | null
    last_name: string
    orcid: string | null
    institution?: string | null
    is_active: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user?: {
      id: number
      first_name: string
      middle_name: string | null
      last_name: string
      orcid: string | null
      institution?: string | null
      is_active: boolean
    } & DefaultSession['user']
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: 'RefreshAccessTokenError'
  }
}
