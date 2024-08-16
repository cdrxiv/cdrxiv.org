'use client'

import { Box } from 'theme-ui'
import { Preprint, VersionQueue } from '../../../../../types/preprint'
import VersionsTable from './versions-table'

type Props = {
  preprint: Preprint
  versions: VersionQueue[]
}
const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  return (
    <Box>
      <Box sx={{ variant: 'styles.h2' }}>Previous updates</Box>
      <VersionsTable versions={versions} />
    </Box>
  )
}

export default EditForm
