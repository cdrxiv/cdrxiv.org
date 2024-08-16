import { Box, Flex } from 'theme-ui'
import React from 'react'

import { Badge, Column, Expander, Field, Row } from '../../../../../components'
import { VersionQueue } from '../../../../../types/preprint'
import { formatDate } from '../../../../../utils/formatters'

type Props = {
  versions: VersionQueue[]
}

const LABELS = {
  metadata_correction: 'Metadata correction',
  correction: 'Text correction',
  version: 'New version',
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

const VersionsTable: React.FC<Props> = ({ versions }) => {
  if (versions.length === 0) {
    return <Box sx={{ variant: 'text.monoCaps', my: 3 }}>None</Box>
  }

  return (
    <>
      <Row columns={[6, 6, 8, 8]} sx={{ flexWrap: 'wrap', mt: 3, mb: 2 }}>
        <Column start={[1, 1, 1, 1]} width={[3, 3, 2, 2]}>
          <Box sx={{ variant: 'text.monoCaps' }}>Type</Box>
        </Column>

        <Column
          start={[4, 4, 5, 5]}
          width={[3, 3, 2, 2]}
          sx={{ textAlign: ['right', 'right', 'left', 'left'] }}
        >
          <Box sx={{ variant: 'text.monoCaps' }}>Date submitted</Box>
        </Column>
      </Row>

      {versions.map((version, i) => (
        <Row
          key={version.date_submitted}
          columns={[6, 6, 8, 8]}
          sx={{
            alignItems: 'center',
            borderTop: '1px solid',
            borderBottom: i === versions.length - 1 ? '1px solid' : 0,
            borderColor: 'listBorderGrey',
            py: 4,
          }}
        >
          <Column start={[1, 1, 1, 1]} width={[3, 3, 3, 3]}>
            <Box sx={{}}>{LABELS[version.update_type]}</Box>
          </Column>
          <Column
            start={[4, 4, 5, 5]}
            width={[3, 3, 2, 2]}
            sx={{ textAlign: ['right', 'right', 'left', 'left'] }}
          >
            <Box
              sx={{
                variant: 'text.monoCaps',
                whiteSpace: 'nowrap',
              }}
            >
              {formatDate(new Date(version.date_submitted))}
            </Box>
          </Column>
          <Column start={[1, 1, 7, 7]} width={2}>
            <Flex
              sx={{
                mt: [3, 3, 0, 0],
                justifyContent: [
                  'flex-start',
                  'flex-start',
                  'flex-end',
                  'flex-end',
                ],
              }}
            >
              <Badge color='muted'>{getStatus(version)}</Badge>
            </Flex>
          </Column>
          <Column start={1} width={[6, 6, 8, 8]} sx={{ mt: 3 }}>
            <Expander label='Details'>
              <Flex sx={{ flexDirection: 'column', gap: 4, mt: 4 }}>
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
          </Column>
        </Row>
      ))}
    </>
  )
}

export default VersionsTable
