'use client'

import { Box, Flex } from 'theme-ui'
import { Preprints } from '../../../types/preprint'
import ListView from './preprints-table'

type Props = {
  published: Preprints
  review: Preprints
  rejected: Preprints
}
const SubmissionsView: React.FC<Props> = ({ published, review, rejected }) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 9, pb: 7 }}>
      <Box>
        <Box sx={{ variant: 'styles.h2' }}>Published</Box>
        <ListView preprints={published} date='date_published' />
      </Box>

      <Box>
        <Box sx={{ variant: 'styles.h2' }}>Under review</Box>
        <ListView preprints={review} date='date_submitted' />
      </Box>

      <Box>
        <Box sx={{ variant: 'styles.h2' }}>Rejected</Box>
        <ListView preprints={rejected} date='date_submitted' />
      </Box>
    </Flex>
  )
}

export default SubmissionsView
