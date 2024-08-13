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
      {preprints.map(({ title, authors, date_published, pk }) => (
        <Card
          key={title}
          title={title}
          authors={authors}
          type={'article'}
          date={date_published ? new Date(date_published) : null}
          href={'/preprint/' + pk} //TODO: check if preprint
        />
      ))}
    </Row>
  )
}

export default GridView
