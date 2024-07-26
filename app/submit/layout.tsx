'use client'

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

import StyledLink from '../../components/link'
import PaneledPage from '../../components/layouts/paneled-page'
import NavLink from '../../components/nav-link'

const UserInfo = () => {
  const [expanded, setExpanded] = useState(false)
  const { data: session, status } = useSession()

  if (status === 'authenticated' && session) {
    return (
      <Box sx={{ position: 'relative' }}>
        <StyledLink onClick={() => setExpanded(!expanded)} showArrow={false}>
          Signed in as {session?.user?.email ?? 'Unknown'}{' '}
          <Box
            sx={{
              display: 'inline-block',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            {'>>'}
          </Box>
        </StyledLink>
        {expanded && (
          <Box sx={{ position: 'absolute', top: '28px' }}>
            <StyledLink
              onClick={() => signOut({ callbackUrl: '/' })}
              showArrow={false}
            >
              Sign out
            </StyledLink>
          </Box>
        )}
      </Box>
    )
  }

  return <StyledLink onClick={() => signIn('janeway')}>Sign in</StyledLink>
}

const PATHS = [
  { label: 'Submission Overview', href: '/submit/overview' },
  { label: 'Submission Information', href: '/submit/info' },
  { label: 'Author Information', href: '/submit/authors' },
  { label: 'Confirmation', href: '/submit/confirm' },
]

const Submit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  console.log(pathname)

  const index = PATHS.findIndex((p) => p.href === pathname)
  const active = PATHS[index >= 0 ? index : 0]

  return (
    <SessionProvider>
      <UserInfo />

      <PaneledPage
        title={active.label}
        corner={`Step ${index + 1} / ${PATHS.length}`}
        sidebar={
          <Box>
            <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>
              Overview
            </Box>
            <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
              {PATHS.map(({ label, href }) => (
                <NavLink key={href} href={href} active={pathname === href}>
                  {label}
                </NavLink>
              ))}
            </Flex>
          </Box>
        }
      >
        {children}
      </PaneledPage>
    </SessionProvider>
  )
}

export default Submit
