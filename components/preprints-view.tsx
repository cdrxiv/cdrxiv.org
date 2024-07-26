'use client'

import { usePreprints } from './preprints-provider'
import Stack from './stack'
import { Preprints } from '../types/preprint'
import Grid from './grid'

const PreprintsView = ({ view }: { view?: string }) => {
  const preprints: Preprints | null = usePreprints()

  if (!preprints) return

  const renderData = () => {
    switch (view?.toLowerCase()) {
      case 'grid':
        return <Grid preprints={preprints} />
      case 'list':
        return <div>List View of Data</div>
      default:
        return <Stack preprints={preprints} />
    }
  }

  return <>{renderData()}</>
}

export default PreprintsView
