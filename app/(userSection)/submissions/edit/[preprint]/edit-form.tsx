'use client'

import { Box } from 'theme-ui'
import { Preprint, VersionQueue } from '../../../../../types/preprint'
import VersionsTable from './versions-table'
import SharedLayout from '../../../shared-layout'

type Props = {
  preprint: Preprint
  versions: VersionQueue[]
}
const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  return (
    <SharedLayout title={preprint.title} back>
      <Box sx={{ variant: 'styles.h2' }}>Previous updates</Box>
      <VersionsTable versions={versions} />
    </SharedLayout>
  )
}

export default EditForm
