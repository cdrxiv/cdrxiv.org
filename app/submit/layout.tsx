'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { redirect, usePathname } from 'next/navigation'

import StyledLink, { Props as LinkProps } from '../../components/link'
import PaneledPage from '../../components/layouts/paneled-page'
import NavLink, { NavLinkProps } from '../../components/nav-link'

const PATHS = [
  { label: 'User login', href: '/submit/login' },
  { label: 'Submission Overview', href: '/submit/overview' },
  { label: 'Submission Information', href: '/submit/info' },
  { label: 'Author Information', href: '/submit/authors' },
  { label: 'Confirmation', href: '/submit/confirm' },
]

const AuthRedirect = ({ active }: { active: string }) => {
  const { status } = useSession()

  if (status === 'unauthenticated' && active !== PATHS[0].href) {
    redirect(PATHS[0].href)
  }

  return null
}

const AuthedNavLink: React.FC<NavLinkProps> = ({ children, active, href }) => {
  const { status } = useSession()

  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  return (
    <NavLink href={href} active={active} disabled={disabled}>
      {children}
    </NavLink>
  )
}

const NextButton: React.FC<LinkProps> = ({ href, ...props }) => {
  const { status } = useSession()

  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  if (disabled) return null

  return <StyledLink href={href} {...props} />
}

const Submit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  const index = PATHS.findIndex((p) => p.href === pathname)
  const active = PATHS[index >= 0 ? index : 0]

  return (
    <SessionProvider>
      <AuthRedirect active={active.href} />
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

        <Flex
          sx={{
            justifyContent: index > 0 ? 'space-between' : 'flex-end',
            mt: 8,
          }}
        >
          {index > 0 && (
            <StyledLink
              href={PATHS[index - 1].href}
              backArrow
              sx={{ variant: 'text.monoCaps' }}
            >
              Prev step
            </StyledLink>
          )}
          {index < PATHS.length - 1 && (
            <NextButton
              href={PATHS[index + 1].href}
              forwardArrow
              sx={{ variant: 'text.monoCaps' }}
            >
              Next step
            </NextButton>
          )}
        </Flex>
      </PaneledPage>
    </SessionProvider>
  )
}

export default Submit
