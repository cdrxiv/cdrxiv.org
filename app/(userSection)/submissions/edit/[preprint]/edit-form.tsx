'use client'

import { Box, Flex } from 'theme-ui'
import { Preprint, VersionQueue } from '../../../../../types/preprint'
import VersionsList from './versions-list'
import SharedLayout from '../../../shared-layout'
import { Field, Link } from '../../../../../components'
import { formatDate } from '../../../../../utils/formatters'

type Props = {
  preprint: Preprint
  versions: VersionQueue[]
}
const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  return (
    <SharedLayout
      title={preprint.title}
      metadata={
        <Flex sx={{ flexDirection: 'column', gap: 8 }}>
          {preprint.date_published && (
            <Field label='Live version'>
              <Box as='ul' sx={{ variant: 'styles.ul' }}>
                <Box
                  as='li'
                  sx={{
                    variant: 'styles.li',
                  }}
                >
                  <Link
                    href={`/preprint/${preprint.pk}`}
                    sx={{ variant: 'text.mono' }}
                  >
                    {formatDate(new Date(preprint.date_published))}
                  </Link>
                </Box>
              </Box>
            </Field>
          )}
          <Field label='Previous updates'>
            <VersionsList versions={versions} />
          </Field>
        </Flex>
      }
      back
    >
      <Box sx={{ variant: 'styles.h2' }}>TK form info</Box>
    </SharedLayout>
  )
}

export default EditForm
