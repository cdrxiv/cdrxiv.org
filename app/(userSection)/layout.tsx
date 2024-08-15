'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { NavLink } from '../../components'
import PaneledPage from '../../components/layouts/paneled-page'

const PATHS = [
  { href: '/login', title: 'Log in', public: true },
  { href: '/submissions', title: 'Submissions' },
]
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const { status } = useSession()

  const title = PATHS.find((p) => p.href === pathname)?.title

  return (
    <PaneledPage
      title={title}
      sidebar={
        <Box>
          <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>
            Overview
          </Box>
          <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
            {PATHS.map(({ href, title, public: publicPath }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
                disabled={!publicPath && status === 'unauthenticated'}
              >
                {title}
              </NavLink>
            ))}
          </Flex>
        </Box>
      }
    >
      {children}
    </PaneledPage>
  )
}

export default Layout
