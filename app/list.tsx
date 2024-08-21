import React from 'react'
import { Box, Flex } from 'theme-ui'
import type { Preprints } from '../types/preprint'
import { formatDate, authorList, submissionTypes } from '../utils/formatters'
import { Badge, Column, Row } from '../components'
import Link from 'next/link'

interface ListViewProps {
  preprints: Preprints
}

const ListView: React.FC<ListViewProps> = ({ preprints }) => {
  return (
    <>
      {preprints.map((preprint, i) => (
        <Link
          href={`/preprint/${preprint.pk}`}
          key={preprint.title}
          passHref
          legacyBehavior
        >
          <a
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
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
              <Row columns={12} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Column start={[1, 1, 1, 1]} width={[12, 12, 4, 4]}>
                  <Box
                    id='title'
                    sx={{
                      variant: 'text.body',
                      color: ['blue', 'blue', 'inherit', 'inherit'],
                      mb: [2, 2, 0, 0],
                    }}
                  >
                    {preprint.title}
                  </Box>
                </Column>
                <Column start={[1, 1, 5, 5]} width={[12, 12, 2, 2]}>
                  <Box
                    sx={{
                      variant: 'text.mono',
                      mb: [2, 2, -1, 0], // baseline adjustment at [2]
                    }}
                  >
                    {authorList(preprint.authors, true)}
                  </Box>
                </Column>
                <Column start={[1, 1, 7, 7]} width={[12, 12, 2, 2]}>
                  <Flex sx={{ gap: 2, mb: [6, 6, 0, 0] }}>
                    <Flex sx={{ gap: 2 }}>
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
                <Column start={[1, 1, 9, 9]} width={[12, 12, 2, 2]}>
                  <Box
                    sx={{
                      variant: 'text.monoCaps',
                      mb: [1, 1, 0, 0],
                    }}
                  >
                    {preprint.date_published
                      ? formatDate(new Date(preprint.date_published))
                      : null}
                  </Box>
                </Column>
                <Column start={[1, 1, 11, 11]} width={[12, 12, 2, 2]}>
                  <Box sx={{ variant: 'text.mono' }}>
                    {preprint.subject.map((sub, i) => (
                      <React.Fragment key={sub.name}>
                        {sub.name}
                        {i !== preprint.subject.length - 1 ? ', ' : null}
                      </React.Fragment>
                    ))}
                  </Box>
                </Column>
              </Row>
            </Box>
          </a>
        </Link>
      ))}
    </>
  )
}

export default ListView
