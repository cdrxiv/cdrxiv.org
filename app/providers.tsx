'use client'
// This component contains Third-part Packages and Providers with an explicit 'use client' directive
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
      {/* TODO: Configure production domain */}
      <PlausibleProvider domain='staging.cdrxiv.org'>
        <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
      </PlausibleProvider>
    </SessionProvider>
  )
}

export default Providers
