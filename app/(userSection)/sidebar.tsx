'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { NavLink } from '../../components'

const PATHS = [
  { href: '/login', title: 'Log in', public: true },
  { href: '/submissions', title: 'Submissions' },
]
const Sidebar = () => {
  const pathname = usePathname()
  const { status } = useSession()

  return (
    <Box>
      <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>Overview</Box>
      <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
        {PATHS.map(({ href, title, public: publicPath }) => (
          <NavLink
            key={href}
            href={href}
            active={pathname.startsWith(href)}
            disabled={!publicPath && status === 'unauthenticated'}
          >
            {title}
          </NavLink>
        ))}
      </Flex>
    </Box>
  )
}

export default Sidebar
