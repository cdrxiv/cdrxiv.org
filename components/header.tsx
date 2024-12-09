import { SVGProps, useEffect, useRef, useState } from 'react'
import { Box, BoxProps, Flex, ThemeUIStyleObject } from 'theme-ui'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createPortal } from 'react-dom'

import Link from './link'
import Search from './search'
import Column from './column'
import Row from './row'
import StyledButton from './button'
import Menu from './menu'
import useBackgroundColors from '../hooks/use-background-colors'
import { isFullSiteEnabled } from '../utils/flags'

type SVGBoxProps = BoxProps & SVGProps<SVGSVGElement>
const SVGBox: React.FC<SVGBoxProps> = (props) => <Box as='svg' {...props} />

const PATHS: { name: string; path: string; matchingPaths?: string[] }[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about', matchingPaths: ['/about'] },
  { name: 'Submit', path: '/submit/overview', matchingPaths: ['/submit'] },
  {
    name: 'Account',
    path: '/account',
    matchingPaths: ['/account', '/submissions', '/preview', '/register'],
  },
]

const UserProfile = () => {
  return (
    <SVGBox
      as='svg'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 448 512'
      sx={{
        height: ['12px', '12px', '12px', '16px'],
        ml: ['-20px', '-20px', '-20px', '-24px'],
        flexShrink: 0,
      }}
    >
      {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
      <path
        fill='currentColor'
        d='M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z'
      />
    </SVGBox>
  )
}

const AccountLink = ({
  sx,
  name,
  path,
  selected,
}: {
  sx?: ThemeUIStyleObject
  name: string
  path: string
  selected: boolean
}) => {
  const { data: session, status } = useSession()
  const authenticated = status === 'authenticated' && !!session

  let accountName = name
  if (authenticated) {
    accountName = `${session.user.first_name} ${session.user.last_name}`
    if (accountName.length > 20) {
      accountName = session.user.first_name
    }
  }

  return (
    <Link
      href={path}
      selected={selected}
      hoverEffect={true}
      sx={{
        width: 'fit-content',
        variant: 'styles.h2',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'baseline',
        gap: 2,
        '&:visited path': {
          fill: 'purple',
        },
        ...sx,
      }}
    >
      <Box as='span' sx={{ flexShrink: 0 }}>
        {accountName}
        &nbsp;&nbsp;&nbsp;&nbsp;
      </Box>
      <UserProfile />
    </Link>
  )
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    right: 0,
    left: 0,
  })
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const { cardBackground } = useBackgroundColors()

  const pathname = usePathname()
  const router = useRouter()

  const renderLinks = () => {
    return PATHS.map(({ name, path, matchingPaths }) => {
      const isSelected =
        pathname === path ||
        (matchingPaths?.some(
          (p) => pathname === p || pathname.startsWith(p + '/'),
        ) ??
          false)

      return name === 'Account' ? (
        <AccountLink key={name} name={name} path={path} selected={isSelected} />
      ) : (
        <Link
          key={name}
          href={path}
          selected={isSelected}
          hoverEffect={true}
          sx={{ width: 'fit-content', variant: 'styles.h2' }}
        >
          {name}
        </Link>
      )
    })
  }

  const handleMenuToggle = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
        left: rect.left,
      })
    }
    setMenuOpen((open) => !open)
  }

  useEffect(() => {
    if (!pathname.startsWith('/search') && searchRef.current) {
      searchRef.current.value = ''
    }
  }, [pathname])

  return (
    <Box
      as='header'
      sx={{
        position: 'sticky',
        top: 0,
        mt: [-24, -24, -27, -27],
        bg: cardBackground,
        zIndex: 2,
      }}
    >
      <Row
        sx={{
          height: [65, 65, 100, 100],
          alignItems: 'center',
        }}
      >
        <Column
          start={1}
          width={3}
          sx={{
            display: isFullSiteEnabled() ? 'inherit' : 'none',
          }}
        >
          <Search
            ref={searchRef}
            placeholder='Search'
            onSubmit={() => {
              router.push(
                `/search?query=${searchRef.current?.value?.replace(/"/g, '') ?? ''}`,
              )
            }}
            arrows={true}
            inverted
            aria-label='Preprint search'
          />
        </Column>
        <Column
          start={isFullSiteEnabled() ? [4, 4, 5, 5] : 1}
          width={[5, 5, 6, 6]}
          sx={{
            display: ['none', 'inherit', 'inherit', 'inherit'],
          }}
        >
          <Flex
            as='nav'
            sx={{
              gap: [4, 4, 8, 10],
            }}
          >
            {renderLinks()}
          </Flex>
        </Column>
        <Column
          start={isFullSiteEnabled() ? 4 : 1}
          width={2}
          sx={{
            display: ['inherit', 'none', 'none', 'none'],
          }}
        >
          <StyledButton
            ref={menuButtonRef}
            onClick={handleMenuToggle}
            sx={{ width: 'fit-content' }}
            aria-expanded={menuOpen}
            aria-haspopup='true'
            aria-controls='mobile-menu'
          >
            Menu
          </StyledButton>
          {menuOpen &&
            createPortal(
              <Menu
                setMenuOpen={setMenuOpen}
                sx={
                  isFullSiteEnabled()
                    ? { top: menuPosition.top, right: menuPosition.right }
                    : { top: menuPosition.top, left: menuPosition.left }
                }
                aria-label='Mobile navigation menu'
              >
                {renderLinks()}
              </Menu>,
              document.body,
            )}
        </Column>
      </Row>
    </Box>
  )
}

export default Header
