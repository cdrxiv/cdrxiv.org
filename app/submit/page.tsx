'use client'

import { Box, Flex } from 'theme-ui'
import { useSession, signIn } from 'next-auth/react'
import StyledButton from '../../components/button'

const UserInfo = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated' && session) {
    return <p>Signed in as {session?.user?.email}</p>
  }

  return <StyledButton onClick={() => signIn('janeway')}>Sign in</StyledButton>
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
