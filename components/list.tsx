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
          key={preprint.title}
          gap={4}
          sx={{
            borderTop: '1px solid',
            borderColor: 'listBorderGrey',
            py: 4,
            alignItems: 'center',
          }}
        >
          <Column start={1} width={4}>
            <Box sx={{ variant: 'text.body' }}>{preprint.title}</Box>
          </Column>
          <Column start={5} width={2}>
            <Box sx={{ variant: 'text.mono' }}>
              {authorList(preprint.authors)}
            </Box>
          </Column>
          <Column start={7} width={1}>
            <Badge color={'pink'}>Article</Badge>
          </Column>
          <Column start={8} width={2}>
            <Box sx={{ variant: 'text.monoCaps' }}>
              {preprint.date_published
                ? formatDate(new Date(preprint.date_published))
                : null}
            </Box>
          </Column>
          <Column start={10} width={2}>
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
      ))}
    </>
  )
}

export default ListView
