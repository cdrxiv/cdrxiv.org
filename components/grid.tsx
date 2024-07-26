import React from 'react'
import { Grid } from 'theme-ui'
import Card from './card'
import type { Preprints } from '../types/preprint'

interface GridViewProps {
  preprints: Preprints
}

const GridView: React.FC<GridViewProps> = ({ preprints }) => {
  return (
    <Grid
      gap={[6, 6, 6, 8]}
      columns={['1fr', '1fr 1fr', '1fr 1fr 1fr', 'repeat(4, 1fr)']}
    >
      {preprints.map(({ title, authors, date_published }) => (
        <Card
          key={title}
          title={title}
          authors={authors}
          type={'article'}
          date={date_published ? new Date(date_published) : null}
        />
      ))}
    </Grid>
  )
}

export default GridView
