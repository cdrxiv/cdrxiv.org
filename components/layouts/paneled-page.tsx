'use client'

import React from 'react'
import { Box, Flex } from 'theme-ui'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'

const HEADER_HEIGHT = 125

const PaneledPage: React.FC<{
  children: React.ReactNode
  metadata?: React.ReactNode
  sidebar: React.ReactNode
  title?: string
  leftCorner?: React.ReactNode
  rightCorner?: React.ReactNode
}> = ({ children, sidebar, metadata, title, leftCorner, rightCorner }) => {
  return (
    <Row sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <Column
        start={1}
        width={3}
        sx={{
          display: ['none', 'none', 'inherit', 'inherit'],
          overflowY: 'auto',
        }}
      >
        {sidebar}
      </Column>
      <Column
        start={[1, 1, 4, 4]}
        width={[6, 6, 6, 6]}
        sx={{
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            background: 'primary',
            px: [0, 0, 6, 8],
            pb: 6,
          }}
        >
          <Box sx={{ contain: 'layout' }}>
            <Guide columns={[6, 6, 8, 8]} color='pink' opacity={0.2} />
            <Row columns={[6, 6, 8, 8]}>
              <Column start={1} width={[6, 6, 8, 8]}>
                <Flex
                  sx={{
                    width: '100%',
                    justifyContent: 'space-between',
                    display: ['none', 'none', 'flex', 'flex'],
                  }}
                >
                  <Box
                    sx={{
                      variant: 'text.monoCaps',
                      mt: 8,
                      mb: 7,
                    }}
                  >
                    {leftCorner}
                  </Box>
                  <Box
                    sx={{
                      variant: 'text.monoCaps',
                      mt: 8,
                      mb: 7,
                    }}
                  >
                    {rightCorner}
                  </Box>
                </Flex>

                <Box as='h1' sx={{ variant: 'text.heading', mb: 7 }}>
                  {title}
                </Box>

                {children}
              </Column>
            </Row>
          </Box>
        </Box>
      </Column>
      <Column
        start={[1, 1, 11, 11]}
        width={[6, 6, 2, 2]}
        sx={{
          display: ['none', 'none', 'inherit', 'inherit'],
          overflowY: 'auto',
        }}
      >
        {metadata}
      </Column>
    </Row>
  )
}

export default PaneledPage
