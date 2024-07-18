'use client'

import { Box, Flex } from 'theme-ui'

export default function AuthTesting() {
  return (
    <main>
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
          <Box>Sign in</Box>
        </Flex>

        <Box sx={{ px: 3, background: 'backgroundGray', flexGrow: 1 }}>
          TK TK TK TK TK some body text
        </Box>
      </Flex>
    </main>
  )
}
