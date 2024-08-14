import React from 'react'
import { Card, Row } from '../components'
import type { Preprints } from '../types/preprint'
import { submissionTypes } from '../utils/formatters'

interface GridViewProps {
  preprints: Preprints
}

const GridView: React.FC<GridViewProps> = ({ preprints }) => {
  return (
    <Row columns={[1, 2, 3, 4]} gap={[5, 6, 6, 8]} sx={{ gridAutoRows: '1fr' }}>
      {preprints.map((preprint) => {
        const { title, authors, date_published } = preprint
        return (
          <Card
            key={title}
            title={title}
            authors={authors}
            badges={submissionTypes(preprint)}
            date={date_published ? new Date(date_published) : null}
          />
        )
      })}
    </Row>
  )
}

export default GridView
