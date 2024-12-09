'use client'

import { Box, Flex } from 'theme-ui'
import { useEffect } from 'react'

import { Button } from '../components'
import useTracking from '../hooks/use-tracking'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const track = useTracking()
  useEffect(() => {
    track('client_error', { error: error.message })
  }, [error.message])
  return (
    <>
      <title>Error - CDRXIV</title>

      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Box>
          <Box sx={{ variant: 'text.monoCaps', fontSize: 4 }}>Client error</Box>
          <Flex
            sx={{
              mt: 2,
              flexDirection: 'column',
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box variant='text.mono'>
              Sorry, something went wrong while rendering the page.
            </Box>
            <Button onClick={reset} sx={{ width: 'fit-content' }}>
              Try again
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
