'use client'
// This component contains Third-party Packages and Providers with an explicit 'use client' directive
// See Next.js docs for more:
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-third-party-packages-and-providers

import { ThemeUIProvider } from 'theme-ui'
import { SessionProvider } from 'next-auth/react'
import PlausibleProvider from 'next-plausible'
import { Session } from 'next-auth'
import { theme } from '../theme/theme'

const Providers = ({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) => {
  return (
    <SessionProvider session={session}>
      <PlausibleProvider
        domain={
          process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
            ? 'cdrxiv.org'
            : 'staging.cdrxiv.org'
        }
        trackOutboundLinks
        trackFileDownloads
      >
        <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
      </PlausibleProvider>
    </SessionProvider>
  )
}

export default Providers
