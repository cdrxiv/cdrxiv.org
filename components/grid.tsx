import React from 'react'
import Card from './card'
import Row from './row'
import type { Preprints } from '../types/preprint'
interface GridViewProps {
  preprints: Preprints
}

const GridView: React.FC<GridViewProps> = ({ preprints }) => {
  return (
    <Row columns={[1, 2, 3, 4]} gap={[5, 6, 6, 8]}>
      {preprints.map(
        ({ title, authors, date_published, pk, additional_field_answers }) => {
          const isPreprint = additional_field_answers.find(
            (answer) =>
              answer?.field?.name === 'Submission type' &&
              answer.answer === 'Article',
          )
          return (
            <Card
              key={title}
              title={title}
              authors={authors}
              type={'article'}
              date={date_published ? new Date(date_published) : null}
              href={isPreprint ? '/preprint/' + pk : undefined}
            />
          )
        },
      )}
    </Row>
  )
}

export default GridView
