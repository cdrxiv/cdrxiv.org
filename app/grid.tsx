import React from 'react'
import { Card, Row } from '../components'
import { submissionTypes } from '../utils/formatters'
import { getAdditionalField } from '../utils/data'
import type { Preprints } from '../types/preprint'

interface GridViewProps {
  preprints: Preprints
}

const GridView: React.FC<GridViewProps> = ({ preprints }) => {
  return (
    <Row columns={[1, 2, 3, 4]} gap={[5, 6, 6, 8]}>
      {preprints.map((preprint) => {
        const { title, authors, date_published, pk, additional_field_answers } =
          preprint
        const isPreprint =
          getAdditionalField(preprint, 'Submission type') === 'Article'
        return (
          <Card
            key={title}
            title={title}
            authors={authors}
            date={date_published ? new Date(date_published) : null}
            badges={submissionTypes(preprint)}
            href={isPreprint ? '/preprint/' + pk : undefined}
          />
        )
      })}
    </Row>
  )
}

export default GridView
