'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'

import StyledLink from '../../../components/link'
import Expander from '../../../components/expander'

const UserInfo = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated' && session) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Expander label={`Signed in as ${session?.user?.email ?? 'Unknown'}`}>
          <Box sx={{ top: '28px' }}>
            <StyledLink onClick={() => signOut({ callbackUrl: '/' })}>
              Sign out
            </StyledLink>
          </Box>
        </Expander>
      </Box>
    )
  }

  return <StyledLink onClick={() => signIn('janeway')}>Sign in</StyledLink>
}

const SubmissionLogin = () => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      <UserInfo />
    </Flex>
  )
}

export default SubmissionLogin
