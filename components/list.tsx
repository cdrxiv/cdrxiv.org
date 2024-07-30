import React from 'react'
import { Box } from 'theme-ui'
import type { Preprints } from '../types/preprint'
import { formatDate, authorList } from '../utils/formatters'
import Row from './row'
import Column from './column'
import Badge from './badge'

interface ListViewProps {
  preprints: Preprints
}

const ListView: React.FC<ListViewProps> = ({ preprints }) => {
  return (
    <>
      {preprints.map((preprint) => (
        <Box
          key={preprint.title}
          sx={{
            borderTop: '1px solid',
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
          {/* Desktop view */}
          <Box sx={{ display: ['none', 'none', 'inherit'] }}>
            <Row columns={12} sx={{ alignItems: 'center' }}>
              <Column start={1} width={4}>
                <Box
                  id='title'
                  sx={{ variant: 'text.body', alignSelf: 'center' }}
                >
                  {preprint.title}
                </Box>
              </Column>
              <Column start={5} width={2}>
                <Box sx={{ variant: 'text.mono', alignSelf: 'baseline' }}>
                  {authorList(preprint.authors, true)}
                </Box>
              </Column>
              <Column start={7} width={2}>
                <Badge color={'pink'}>Article</Badge>
              </Column>
              <Column start={9} width={2}>
                <Box sx={{ variant: 'text.monoCaps', alignSelf: 'baseline' }}>
                  {preprint.date_published
                    ? formatDate(new Date(preprint.date_published))
                    : null}
                </Box>
              </Column>
              <Column start={11} width={2}>
                <Box sx={{ variant: 'text.mono', alignSelf: 'center' }}>
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

          {/* Mobile view */}
          <Box sx={{ display: ['inherit', 'inherit', 'none'] }}>
            <Box sx={{ variant: 'text.body', color: 'blue' }}>
              {preprint.title}
            </Box>
            <Box sx={{ variant: 'text.mono', my: 2 }}>
              {authorList(preprint.authors, true)}
            </Box>
            <Badge color={'pink'}>Article</Badge>
            <Box sx={{ variant: 'text.monoCaps', mt: 6 }}>
              {preprint.date_published
                ? formatDate(new Date(preprint.date_published))
                : null}
            </Box>
            <Box sx={{ variant: 'text.mono', mt: 1 }}>
              {preprint.subject.map((sub, i) => (
                <React.Fragment key={sub.name}>
                  {sub.name}
                  {i !== preprint.subject.length - 1 ? ', ' : null}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default ListView
