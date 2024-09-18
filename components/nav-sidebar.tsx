'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { NavLink } from '.'

interface NavSidebarProps {
  paths: {
    href: string
    title: string
    public?: boolean
    adminOnly?: boolean
  }[]
}

const NavSidebar: React.FC<NavSidebarProps> = ({ paths }) => {
  const pathname = usePathname()
  const { status } = useSession()

  return (
    <Box>
      <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>Overview</Box>
      <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
        {paths.map(({ href, title, public: publicPath }) => (
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
  )
}

export default NavSidebar
