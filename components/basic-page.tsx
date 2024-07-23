'use client'

import React from 'react'
import { Box } from 'theme-ui'
import Header from './header'

const margin = 12

const BasicPage = ({ children }: { children: React.ReactNode }) => {
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
          borderLeft: '1px solid',
          borderBottom: '1px solid',
          borderRight: '1px solid',
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
