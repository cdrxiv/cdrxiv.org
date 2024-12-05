'use client'

import { Box, Flex } from 'theme-ui'

import { Preprints } from '../../../../types/preprint'
import PreprintsTable from './preprints-table'

type Props = {
  published: Preprints
  review: Preprints
  rejected: Preprints
}
const SubmissionsView: React.FC<Props> = ({ published, review, rejected }) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 9, pb: 7 }}>
      {published.length > 0 && (
        <Box>
          <Box sx={{ fontSize: [3, 3, 4, 4] }}>Published</Box>
          <PreprintsTable preprints={published} date='date_published' />
        </Box>
      )}

      {review.length > 0 && (
        <Box>
          <Box sx={{ fontSize: [3, 3, 4, 4] }}>Screening in Progress</Box>
          <PreprintsTable preprints={review} date='date_submitted' />
        </Box>
      )}

      {rejected.length > 0 && (
        <Box>
          <Box sx={{ fontSize: [3, 3, 4, 4] }}>Declined</Box>
          <PreprintsTable preprints={rejected} date='date_submitted' />
        </Box>
      )}
      {[published, review, rejected].every((list) => list.length === 0) && (
        <Box>No preprints have been submitted yet</Box>
      )}
    </Flex>
  )
}

export default SubmissionsView
