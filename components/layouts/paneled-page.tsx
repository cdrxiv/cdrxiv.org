import React from 'react'
import { Box } from 'theme-ui'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'

const PaneledPage: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <Row>
      <Column
        start={1}
        width={3}
        sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
      >
        Sidebar
      </Column>
      <Column start={[1, 1, 4, 4]} width={[6, 6, 6, 6]}>
        <Box
          sx={{
            width: '100%',
            background: 'white',
            minHeight: '300px',
            overflowY: 'scroll',
            py: 10,
            px: [0, 0, 6, 8],
          }}
        >
          <Box sx={{ contain: 'layout' }}>
            <Guide columns={[6, 6, 8, 8]} color='articlePink' opacity={0.2} />
            <Row columns={[6, 6, 8, 8]}>
              <Column start={1} width={[6, 6, 8, 8]}>
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
        Metadata
      </Column>
    </Row>
  )
}

export default PaneledPage
