'use client'

import { usePreprints } from './preprints-provider'
import Stack from './stack'
import type { Preprints } from '../types/preprint'
import Grid from './grid'
import List from './list'

const PreprintsView = ({ view }: { view?: string }) => {
  const preprints: Preprints | null = usePreprints()

  if (!preprints) return

  switch (view?.toLowerCase()) {
    case 'grid':
      return <Grid preprints={preprints} />
    case 'list':
      return <List preprints={preprints} />
    default:
      return <Stack preprints={preprints} />
  }
}

export default PreprintsView
