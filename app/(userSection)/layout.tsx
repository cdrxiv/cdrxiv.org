'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname, useRouter } from 'next/navigation'

import { Link, NavLink } from '../../components'
import PaneledPage from '../../components/layouts/paneled-page'

const PATHS = [
  { href: '/login', title: 'Log in', public: true },
  {
    href: '/submissions/edit',
    title: 'Update submission',
    hidden: true,
    back: true,
  },
  { href: '/submissions', title: 'Submissions' },
]
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const { status } = useSession()
  const router = useRouter()

  const currentPath = PATHS.find((p) => pathname.startsWith(p.href))
  const title = currentPath?.title

  return (
    <PaneledPage
      title={title}
      leftCorner={
        currentPath?.back && (
          <Link
            sx={{ variant: 'text.monoCaps' }}
            backArrow
            onClick={router.back}
          >
            Back
          </Link>
        )
      }
      sidebar={
        <Box>
          <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>
            Overview
          </Box>
          <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
            {PATHS.filter((p) => !p.hidden).map(
              ({ href, title, public: publicPath }) => (
                <NavLink
                  key={href}
                  href={href}
                  active={pathname.startsWith(href)}
                  disabled={!publicPath && status === 'unauthenticated'}
                >
                  {title}
                </NavLink>
              ),
            )}
          </Flex>
        </Box>
      }
    >
      {children}
    </PaneledPage>
  )
}

export default Layout
