'use client'

import React from 'react'
import NextLink from 'next/link'
import { Box, Flex } from 'theme-ui'

import { formatDate, submissionTypes } from '../../../../utils/formatters'
import { Badge, Column, Row } from '../../../../components'
import { Preprint, Preprints } from '../../../../types/preprint'

interface PreprintsTableProps {
  preprints: Preprints
  date: 'date_published' | 'date_submitted'
}

const getDateValue = (preprint: Preprint) => {
  let date = new Date()
  if (preprint.date_published) {
    date = new Date(preprint.date_published)
  } else if (preprint.date_submitted) {
    date = new Date(preprint.date_submitted)
  }

  return date.valueOf()
}

const PreprintsTable: React.FC<PreprintsTableProps> = ({ preprints, date }) => {
  if (preprints.length === 0) {
    return <Box sx={{ variant: 'text.monoCaps', my: 3 }}>None</Box>
  }
  return (
    <Box as='ul' sx={{ p: 0 }}>
      <Row
        columns={[6, 6, 8, 8]}
        sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 3, mb: 2 }}
      >
        <Column start={[1, 1, 1, 1]} width={[3, 3, 4, 4]}>
          <Box sx={{ variant: 'text.monoCaps' }}>Title</Box>
        </Column>

        <Column
          start={[4, 4, 5, 5]}
          width={[3, 3, 4, 4]}
          sx={{ textAlign: ['right', 'right', 'left', 'left'] }}
        >
          <Box sx={{ variant: 'text.monoCaps' }}>
            {date === 'date_published' ? 'Published' : 'Submitted'}
          </Box>
        </Column>
      </Row>

      {preprints
        .sort((a: Preprint, b: Preprint) => getDateValue(b) - getDateValue(a))
        .map((preprint, i) => (
          <Box as='li' key={preprint.pk} sx={{ listStyle: 'none' }}>
            <NextLink
              href={`/submissions/edit/${preprint.pk}`}
              key={preprint.pk}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  color: 'text',
                  borderTop: '1px solid',
                  borderBottom: i === preprints.length - 1 ? '1px solid' : 0,
                  borderColor: 'listBorderGrey',
                  py: 4,
                  ':hover': {
                    cursor: 'pointer',
                    bg: 'white',
                    '#title': {
                      color: 'blue',
                    },
                  },
                }}
              >
                <Row
                  columns={[6, 6, 8, 8]}
                  sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                >
                  <Column start={[1, 1, 1, 1]} width={[6, 6, 4, 4]}>
                    <Box
                      id='title'
                      sx={{
                        variant: 'text.body',
                        color: ['blue', 'blue', 'inherit', 'inherit'],
                        mb: [4, 4, 0, 0],
                      }}
                    >
                      {preprint.title}
                    </Box>
                  </Column>
                  <Column start={[1, 1, 5, 5]} width={[6, 6, 4, 4]}>
                    <Flex
                      sx={{
                        flexDirection: [
                          'row-reverse',
                          'row-reverse',
                          'row',
                          'row',
                        ],
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <Box
                        sx={{
                          variant: 'text.monoCaps',
                          width: 'fit-content',
                        }}
                      >
                        {preprint[date]
                          ? formatDate(new Date(preprint[date]))
                          : null}
                      </Box>
                      <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
                        {submissionTypes(preprint).map((badge) => (
                          <Badge key={badge.label} color={badge.color}>
                            {badge.label}
                          </Badge>
                        ))}
                        {submissionTypes(preprint).length === 0 && (
                          <Box
                            sx={{
                              variant: 'text.monoCaps',
                              color: 'listBorderGrey',
                            }}
                          >
                            Not labeled
                          </Box>
                        )}
                      </Flex>
                    </Flex>
                  </Column>
                </Row>
              </Box>
            </NextLink>
          </Box>
        ))}
    </Box>
  )
}

export default PreprintsTable
