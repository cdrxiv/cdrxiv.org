import React from 'react'
import { Box } from 'theme-ui'
import { Preprints } from '../types/preprint'
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
        <Row
          columns={[1, 12]}
          key={preprint.title}
          sx={{
            borderTop: '1px solid',
            borderColor: 'listBorderGrey',
            py: 4,
            alignItems: 'center',
            ':hover': {
              cursor: 'pointer',
              bg: 'white',
              '#title': {
                color: 'blue',
              },
            },
          }}
        >
          <Box
            sx={{
              display: ['none', 'inherit'],
            }}
          >
            <Column start={1} width={4}>
              <Box id='title' sx={{ variant: 'text.body' }}>
                {preprint.title}
              </Box>
            </Column>
            <Column start={5} width={2}>
              <Box sx={{ variant: 'text.mono' }}>
                {authorList(preprint.authors)}
              </Box>
            </Column>
            <Column start={7} width={2}>
              <Badge color={'pink'}>Article</Badge>
            </Column>
            <Column start={9} width={2}>
              <Box sx={{ variant: 'text.monoCaps' }}>
                {preprint.date_published
                  ? formatDate(new Date(preprint.date_published))
                  : null}
              </Box>
            </Column>
            <Column start={11} width={2}>
              <Box sx={{ variant: 'text.mono' }}>
                {preprint.subject.map((sub, i) => (
                  <React.Fragment key={sub.name}>
                    {sub.name}
                    {i !== preprint.subject.length - 1 ? ', ' : null}
                  </React.Fragment>
                ))}
              </Box>
            </Column>
          </Box>

          {/* Mobile view */}
          <Box sx={{ display: ['inherit', 'none'] }}>
            <Box sx={{ variant: 'text.body', color: 'blue' }}>
              {preprint.title}
            </Box>
            <Box sx={{ variant: 'text.mono' }}>
              <Box sx={{ variant: 'text.mono', my: 2 }}>
                {authorList(preprint.authors)}
              </Box>
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
        </Row>
      ))}
    </>
  )
}

export default ListView
