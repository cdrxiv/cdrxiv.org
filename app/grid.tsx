import React from 'react'
import { Card, Row } from '../components'
import { submissionTypes } from '../utils/formatters'
import type { PublishedPreprint } from '../types/preprint'

interface GridViewProps {
  preprints: PublishedPreprint[]
}

const GridView: React.FC<GridViewProps> = ({ preprints }) => {
  return (
    <Row
      as='ul'
      aria-label='Preprints'
      columns={[1, 2, 3, 4]}
      gap={[5, 6, 6, 8]}
      sx={{
        gridAutoRows: '1fr',
        mb: ['18px', '36px', '36px', '52px'],
        padding: 0,
      }}
    >
      {preprints.map((preprint) => {
        const { title, authors, date_published, pk } = preprint
        return (
          <Card
            key={pk}
            title={title}
            authors={authors}
            date={date_published ? new Date(date_published) : null}
            badges={submissionTypes(preprint)}
            href={'/preprint/' + pk}
          />
        )
      })}
    </Row>
  )
}

export default GridView
