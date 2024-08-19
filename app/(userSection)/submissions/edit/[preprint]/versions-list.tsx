import { Box, Flex } from 'theme-ui'
import React from 'react'

import { Badge, Expander, Field } from '../../../../../components'
import { VersionQueue } from '../../../../../types/preprint'
import { formatDate } from '../../../../../utils/formatters'
import { UPDATE_TYPE_LABELS } from './constants'

type Props = {
  versions: VersionQueue[]
}

const getStatus = ({ date_decision, approved }: VersionQueue) => {
  if (date_decision && approved) {
    return 'Approved'
  } else if (date_decision && !approved) {
    return 'Rejected'
  } else {
    return 'Under review'
  }
}

const VersionsList: React.FC<Props> = ({ versions }) => {
  if (versions.length === 0) {
    return <Box sx={{ variant: 'text.mono' }}>None</Box>
  }

  return (
    <>
      {versions.map((version, i) => (
        <Box key={version.date_submitted}>
          <Expander
            label={formatDate(new Date(version.date_submitted))}
            sx={{ variant: 'text.mono' }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                gap: 4,
                mt: 4,
                borderBottom: '1px solid',
                borderColor: 'listBorderGrey',
                pb: 4,
              }}
            >
              <Field label='status'>
                <Badge color='muted'>{getStatus(version)}</Badge>
              </Field>
              <Field label='type'>
                <Box sx={{ variant: 'text.mono' }}>
                  {UPDATE_TYPE_LABELS[version.update_type]}
                </Box>
              </Field>
              <Field label='title'>
                <Box sx={{ variant: 'text.mono' }}>{version.title}</Box>
              </Field>
              <Field label='abstract'>
                <Box sx={{ variant: 'text.mono' }}>{version.abstract}</Box>
              </Field>
              {version.file && (
                <Field label='file'>
                  <Box sx={{ variant: 'text.mono' }}>{version.file}</Box>
                </Field>
              )}
              {version.published_doi && (
                <Field label='published_doi'>
                  <Box sx={{ variant: 'text.mono' }}>
                    {version.published_doi}
                  </Box>
                </Field>
              )}
            </Flex>
          </Expander>
        </Box>
      ))}
    </>
  )
}

export default VersionsList
