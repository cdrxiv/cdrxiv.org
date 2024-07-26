import React from 'react'
import { Box } from 'theme-ui'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'

const PaneledPage: React.FC<{
  children: React.ReactNode
  metadata?: React.ReactNode
  sidebar: React.ReactNode
  title?: string
  corner?: string
}> = ({ children, sidebar, metadata, title, corner }) => {
  return (
    <Row>
      <Column
        start={1}
        width={3}
        sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
      >
        {sidebar}
      </Column>
      <Column start={[1, 1, 4, 4]} width={[6, 6, 6, 6]}>
        {corner && (
          <Row columns={6} sx={{ display: ['none', 'none', 'grid', 'grid'] }}>
            <Column start={6} width={1} sx={{ position: 'relative' }}>
              <Box
                sx={{
                  variant: 'text.monoCaps',
                  position: 'absolute',
                  mt: 8,
                }}
              >
                {corner}
              </Box>
            </Column>
          </Row>
        )}

        <Box
          sx={{
            width: '100%',
            background: 'primary',
            minHeight: '300px',
            overflowY: 'scroll',
            py: 10,
            px: [0, 0, 6, 8],
          }}
        >
          <Box sx={{ contain: 'layout' }}>
            <Guide columns={[6, 6, 8, 8]} color='pink' opacity={0.2} />
            <Row columns={[6, 6, 8, 8]}>
              <Column start={1} width={[6, 6, 8, 8]}>
                <Box as='h1' sx={{ variant: 'text.heading', mb: 5 }}>
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
        sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
      >
        {metadata}
      </Column>
    </Row>
  )
}

export default PaneledPage
