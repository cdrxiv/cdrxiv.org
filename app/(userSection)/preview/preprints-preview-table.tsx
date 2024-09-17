'use client'

import React from 'react'
import { Box, Flex, BoxProps, LinkProps } from 'theme-ui'

import { authorList, submissionTypes } from '../../../utils/formatters'
import { Badge, Column, Row } from '../../../components'
import { Preprint, Preprints } from '../../../types/preprint'

interface PreprintsTableProps {
  preprints: Preprints
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

type LinkBoxProps = BoxProps & LinkProps & { as: string }
const LinkBox: React.FC<LinkBoxProps> = (props) => <Box {...props} />

const Empty = ({ label = 'None' }: { label?: string }) => {
  return (
    <Box
      sx={{
        variant: 'text.monoCaps',
        color: 'listBorderGrey',
      }}
    >
      {label}
      <Box as='span' sx={{ color: 'red' }}>
        &nbsp;(!)
      </Box>
    </Box>
  )
}

const PreprintsTable: React.FC<PreprintsTableProps> = ({ preprints }) => {
  if (preprints.length === 0) {
    return <Box sx={{ variant: 'text.monoCaps', my: 3 }}>None</Box>
  }
  return (
    <>
      <Row
        columns={[6, 6, 8, 8]}
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          mt: 3,
          mb: 2,
        }}
      >
        <Column
          start={[1, 1, 1, 1]}
          width={[3, 3, 3, 3]}
          sx={{ variant: 'text.monoCaps' }}
        >
          Title
        </Column>
        <Column
          start={[1, 1, 4, 4]}
          width={[3, 3, 3, 3]}
          sx={{
            variant: 'text.monoCaps',
            display: ['none', 'none', 'inherit', 'inherit'],
          }}
        >
          First author
        </Column>

        <Column
          start={[4, 5, 7, 7]}
          width={[3, 2, 2, 2]}
          sx={{ variant: 'text.monoCaps' }}
        >
          Submitted
        </Column>
      </Row>

      {preprints
        .sort((a: Preprint, b: Preprint) => getDateValue(b) - getDateValue(a))
        .map((preprint, i) => (
          <LinkBox
            as='a'
            key={preprint.pk}
            href={`/preview/${preprint.pk}`}
            aria-label={`Preview "${preprint.title}"`}
            sx={{ textDecoration: 'none', color: 'text' }}
          >
            <Box
              sx={{
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
                <Column start={[1, 1, 1, 1]} width={[6, 4, 3, 3]}>
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
                <Column start={[1, 1, 4, 4]} width={[6, 4, 3, 3]}>
                  <Box
                    sx={{
                      variant: 'text.monoCaps',
                      mb: [4, 0, 0, 0],
                    }}
                  >
                    {preprint.authors[0] ? (
                      authorList([preprint.authors[0]])
                    ) : (
                      <Empty />
                    )}
                  </Box>
                </Column>
                <Column start={[1, 5, 7, 7]} width={[6, 2, 2, 2]}>
                  <Box sx={{ variant: 'text.monoCaps' }}>
                    {preprint.date_submitted
                      ? new Date(preprint.date_submitted)
                          .toLocaleDateString('en-US', {
                            year: '2-digit',
                            month: 'short',
                            day: 'numeric',
                          })
                          .replace(',', '')
                      : null}
                  </Box>
                </Column>
                <Column start={1} width={6}>
                  <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 3 }}>
                    {submissionTypes(preprint).map((badge) => (
                      <Badge key={badge.label} color={badge.color}>
                        {badge.label}
                      </Badge>
                    ))}
                    {submissionTypes(preprint).length === 0 && (
                      <Empty label='Not labeled' />
                    )}
                  </Flex>
                </Column>
              </Row>
            </Box>
          </LinkBox>
        ))}
    </>
  )
}

export default PreprintsTable
