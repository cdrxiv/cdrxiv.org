import type { Preprints } from '../types/preprint'
import Grid from './grid'
import List from './list'

const PreprintsView = ({
  preprints,
  view,
}: {
  preprints: Preprints
  view?: string
}) => {
  if (!preprints) return

  switch (view?.toLowerCase()) {
    case 'grid':
      return <Grid preprints={preprints} />
    case 'list':
      return <List preprints={preprints} />
    default:
      return <Grid preprints={preprints} />
  }
}

export default PreprintsView
