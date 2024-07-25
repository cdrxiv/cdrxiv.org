'use client'

import { Box } from 'theme-ui'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

import StyledLink from '../../components/link'
import PaneledPage from '../../components/layouts/paneled-page'

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
    <>
      <UserInfo />

      <PaneledPage>Testing</PaneledPage>
    </>
  )
}
