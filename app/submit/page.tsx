'use client'

import { Box, Flex } from 'theme-ui'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

import StyledLink from '../../components/link'

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

export default function AuthTesting() {
  return (
    <Flex
      sx={{
        height: '100vh',
        width: '100vw',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        sx={{
          width: '100%',
          height: 56,
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          background: 'backgroundGray',
        }}
      >
        <Box>CDRXIV</Box>
        <UserInfo />
      </Flex>

      <Box sx={{ px: 3, background: 'backgroundGray', flexGrow: 1 }}>
        Something about preparing a submission TK TK TK !
      </Box>
    </Flex>
  )
}
