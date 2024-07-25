'use client'

import React from 'react'
import { Box } from 'theme-ui'
import Header from '../header'
import Guide from '../guide'

const margin = [2, 2, 3, 3]

const PageCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        m: margin,
        height: (theme) =>
          margin.map(
            (space) =>
              `calc(100vh - 2 * ${theme.space ? theme.space[space] : 0}px)`,
          ),
        width: (theme) =>
          margin.map(
            (space) =>
              `calc(100vw - 2 * ${theme.space ? theme.space[space] : 0}px)`,
          ),
        position: 'fixed',
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          bg: 'background',
          borderLeft: '1px solid',
          borderBottom: '1px solid',
          borderRight: '1px solid',
          borderColor: 'black',
        }}
      >
        <Header />
        <Box
          sx={{
            mt: 100,
            px: ['18px', '36px', '36px', '52px'],
          }}
        >
          <Box sx={{ contain: 'layout' }}>
            <Guide />
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PageCard
