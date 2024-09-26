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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const NavSidebar: React.FC<NavSidebarProps> = ({ paths, onClick }) => {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <Box>
      <Box
        sx={{
          display: ['none', 'none', 'inherit', 'inherit'],
          variant: 'text.monoCaps',
          mb: [3, 5, 5, 6],
          mt: 5,
        }}
      >
        Overview
      </Box>
      <Flex sx={{ flexDirection: 'column', gap: [3, 5, 5, 6] }}>
        {paths.map(({ href, title, public: publicPath, adminOnly }) =>
          !adminOnly || session?.user?.email?.endsWith('@carbonplan.org') ? (
            <NavLink
              key={href}
              href={href}
              title={title}
              active={pathname === href}
              disabled={!publicPath && status === 'unauthenticated'}
              onClick={onClick ? (e) => onClick(e) : undefined}
            >
              {title}
            </NavLink>
          ) : null,
        )}
      </Flex>
    </Box>
  )
}

export default NavSidebar
