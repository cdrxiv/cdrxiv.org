'use client'

import React, { useState } from 'react'
import { Box } from 'theme-ui'
import useBackgroundColors from '../../hooks/use-background-colors'
import Guide from '../guide'
import Header from '../header'
import MouseTrail from '../mouse-trail'
import PageCorner from '../page-corner'


const margin = [2, 2, 3, 3]

const PageCard = ({ children }: { children: React.ReactNode }) => {
  const { cardBackground, overallBackground } = useBackgroundColors()
  const [isTrailActive, setIsTrailActive] = useState(false)

  const toggleTrail = () => {
    setIsTrailActive((prev) => !prev)
  }

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
            bg: cardBackground,
            border: '1px solid',
            borderColor: 'text',
            px: ['18px', '36px', '36px', '52px'],
          }}
        >
          <PageCorner onToggle={toggleTrail} />
          <MouseTrail isActive={isTrailActive} />
   

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
