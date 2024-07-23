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
        position: 'fixed',
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          bg: 'grey',
          px: 2,
          borderLeft: '1px solid',
          borderBottom: '1px solid',
          borderRight: '1px solid',
          borderColor: 'primary',
        }}
      >
        <Header />
        <Box sx={{ mt: 100 }}>{children}</Box>
        <div> tslkjsdf</div>
      </Box>
    </Box>
  )
}

export default BasicPage
