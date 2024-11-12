'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

import { fetchPublishedPreprints } from '../actions'
import type { PublishedPreprint } from '../types/preprint'
import List from './list'
import Grid from './grid'
import { Link } from '../components'

type ViewType = 'grid' | 'list'
type Props = {
  preprints: PublishedPreprint[]
  nextPage?: string
}

const PreprintsView = (props: Props) => {
  const [nextPage, setNextPage] = useState(props.nextPage)
  const [preprints, setPreprints] = useState(props.preprints)
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

  useEffect(() => {
    setPreprints(props.preprints)
    setNextPage(props.nextPage)
  }, [props.preprints, props.nextPage])

  const handleNextPage = useCallback(() => {
    if (nextPage) {
      fetchPublishedPreprints(nextPage).then((results) => {
        setNextPage(results.next)
        setPreprints((prev) => [...prev, ...results.results])
      })
    }
  }, [nextPage])

  return (
    <>
      {currentView === 'list' ? (
        <List preprints={preprints} />
      ) : (
        <Grid preprints={preprints} />
      )}
      {nextPage && <Link onClick={handleNextPage}>View more</Link>}
    </>
  )
}

export default PreprintsView
