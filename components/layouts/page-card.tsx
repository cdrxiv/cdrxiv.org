'use client'

import React from 'react'
import { Box } from 'theme-ui'
import Header from '../header'
import PageCorner from '../page-corner'
import Guide from '../guide'
import useBackgroundColors from '../../hooks/useBackgroundColors'

const margin = [2, 2, 3, 3]

const PageCard = ({ children }: { children: React.ReactNode }) => {
  const { cardBackground, overallBackground } = useBackgroundColors()

  return (
    <Box sx={{ bg: overallBackground, width: '100vw', height: '100vh' }}>
      <Box
        sx={{
          m: margin,
          height: (theme) =>
            margin.map(
              (space) =>
                `calc(100vh - 2 * ${theme.space ? theme.space[space] : 0}px)`,
            ),
          position: 'fixed',
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            bg: cardBackground,
            border: '1px solid',
            borderColor: 'text',
            px: ['18px', '36px', '36px', '52px'],
          }}
        >
          <PageCorner />

          <Box sx={{ contain: 'layout' }}>
            <Guide />
            <Header />
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PageCard
