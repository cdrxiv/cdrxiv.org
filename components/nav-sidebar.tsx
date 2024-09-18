'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import { NavLink } from '.'
import { useLinkWithWarning } from '../app/submit/navigation-context'

interface NavLinkItemProps {
  href: string
  title: string
  active: boolean
  disabled: boolean
  linkWarning: boolean
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  href,
  title,
  active,
  disabled,
  linkWarning,
}) => {
  const { onClick } = useLinkWithWarning(href)
  return (
    <NavLink
      href={href}
      active={active}
      disabled={disabled}
      onClick={linkWarning ? onClick : undefined}
    >
      {title}
    </NavLink>
  )
}

interface NavSidebarProps {
  paths: {
    href: string
    title: string
    public?: boolean
    adminOnly?: boolean
  }[]
  linkWarning?: boolean
}

const NavSidebar: React.FC<NavSidebarProps> = ({
  paths,
  linkWarning = false,
}) => {
  const pathname = usePathname()
  const { status } = useSession()

  return (
    <Box>
      <Box sx={{ variant: 'text.monoCaps', mb: [5, 5, 5, 6] }}>Overview</Box>
      <Flex sx={{ flexDirection: 'column', gap: [5, 5, 5, 6] }}>
        {paths.map(({ href, title, public: publicPath }) => (
          <NavLinkItem
            key={href}
            href={href}
            title={title}
            active={pathname === href}
            disabled={!publicPath && status === 'unauthenticated'}
            linkWarning={linkWarning}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default NavSidebar
