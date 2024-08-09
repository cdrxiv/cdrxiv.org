'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { PATHS } from './constants'
import { NavigationProvider, useLinkWithWarning } from './navigation-context'
import PaneledPage from '../../components/layouts/paneled-page'
import NavLink, { NavLinkProps } from '../../components/nav-link'

const AuthedNavLink: React.FC<NavLinkProps> = ({ children, active, href }) => {
  const { status } = useSession()
  const { onClick } = useLinkWithWarning(href as string)
  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  return (
    <NavLink onClick={onClick} active={active} disabled={disabled}>
      {children}
    </NavLink>
  )
}

const Submit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0
  const active = PATHS[index]

  return (
    <SessionProvider>
      <NavigationProvider>
        <PaneledPage
          title={active.label}
          corner={`Step ${index} / ${PATHS.length - 1}`}
          sidebar={
            <Box>
              <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>
                Overview
              </Box>
              <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
                {PATHS.map(({ label, href }) => (
                  <AuthedNavLink
                    key={href}
                    href={href}
                    active={pathname === href}
                  >
                    {label}
                  </AuthedNavLink>
                ))}
              </Flex>
            </Box>
          }
        >
          {children}
        </PaneledPage>
      </NavigationProvider>
    </SessionProvider>
  )
}

export default Submit
