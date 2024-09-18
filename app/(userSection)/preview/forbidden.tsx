'use client'

import { useSession } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'

const Forbidden = ({
  status,
  statusText,
}: {
  status: number
  statusText: string
}) => {
  const { data: session } = useSession()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 5 }}>
      <Box sx={{ variant: 'styles.error' }}>
        Status {status}: {statusText}
      </Box>
      Logged in as {session?.user.email}, but unable to fetch data. Please make
      sure that your account has repository manager privileges.
    </Flex>
  )
}

export default Forbidden
