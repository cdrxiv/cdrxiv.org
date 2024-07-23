'use client'

import React, { SVGProps } from 'react'
import { Box, BoxProps, useThemeUI } from 'theme-ui'
import Header from './header'

const margin = 12

const BasicPage = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeUI()
  return (
    <Box
      sx={{
        m: `${margin}px`,
        height: `calc(100vh - 2 * ${margin}px)`,
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          bg: 'backgroundGray',
          p: 3,
          border: '1px solid',
          borderColor: 'black',
          overscrollBehavior: 'none',
        }}
      >
        <Header />
        <Box sx={{ mt: 80 }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default BasicPage
