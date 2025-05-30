'use client'

import { Box, Divider, Flex } from 'theme-ui'
import { Column, Row } from '../components'
import Topics from './topics'
import ViewSelector from './view-selector'

interface LandingPageProps {
  children?: React.ReactNode
}

const LandingPage: React.FC<LandingPageProps> = ({ children }) => {
  return (
    <>
      <Row columns={[6, 8, 12, 12]} sx={{ mb: [4, 4, 8, 8] }}>
        <Column start={1} width={[6, 8, 3, 3]}>
          <Box
            as='h1'
            sx={{
              variant: 'styles.h1',
              mt: [2, 2, 0, 0],
              mb: [6, 6, 4, 4],
              pt: [0, 0, '2px', 0], // fix for clipping of text.
            }}
          >
            Preprints&nbsp;and <br />
            Data&nbsp;for&nbsp;Carbon <br />
            Dioxide&nbsp;Removal
          </Box>
          <Divider
            sx={{
              mt: 6,
              mb: 8,
              display: ['inherit', 'inherit', 'none', 'none'],
            }}
          />
        </Column>

        <Topics />

        <Column start={[4, 5, 1, 1]} width={[3, 4, 6, 6]}>
          <Flex
            sx={{
              gap: [1, 1, 6, 6],
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box as='h2' sx={{ variant: 'text.monoCaps' }}>
              Recent preprints
            </Box>
            <ViewSelector />
          </Flex>
        </Column>
      </Row>
      {children}
    </>
  )
}

export default LandingPage
