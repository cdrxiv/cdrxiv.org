import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      first_name: string
      middle_name?: string
      last_name: string
      orcid?: string
      is_active: boolean
    } & DefaultSession['user']
  }
}
