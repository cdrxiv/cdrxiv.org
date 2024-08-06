'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import type { Preprints } from '../types/preprint'
import List from './list'
import Grid from './grid'

type ViewType = 'grid' | 'list'

const PreprintsView = ({ preprints }: { preprints: Preprints }) => {
  const searchParams = useSearchParams()

  const [currentView, setCurrentView] = useState<ViewType>(
    () => (searchParams.get('view') as ViewType) || 'grid',
  )

  useEffect(() => {
    const view = searchParams.get('view') as ViewType
    if (view === 'grid' || view === 'list') {
      setCurrentView(view)
    }
  }, [searchParams])

  return (
    <>
      {currentView === 'list' ? (
        <List preprints={preprints} />
      ) : (
        <Grid preprints={preprints} />
      )}
    </>
  )
}

export default PreprintsView
