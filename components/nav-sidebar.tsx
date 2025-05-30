'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex, ThemeUIStyleObject } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { NavLink } from '.'

interface NavSidebarProps {
  paths: {
    key?: string
    href: string
    title: string
    sx?: ThemeUIStyleObject
    onClick?: () => void
    public: boolean
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
        }}
      >
        Overview
      </Box>
      <Flex sx={{ flexDirection: 'column', gap: [3, 5, 5, 6] }}>
        {paths.map(
          ({
            key,
            href,
            title,
            public: publicPath,
            adminOnly,
            sx,
            onClick: onClickInner,
          }) =>
            !adminOnly || session?.user?.email?.endsWith('@carbonplan.org') ? (
              <NavLink
                key={key ?? href}
                href={href}
                title={title}
                active={pathname === href}
                disabled={!publicPath && status === 'unauthenticated'}
                onClick={onClickInner ?? onClick}
                sx={sx}
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
