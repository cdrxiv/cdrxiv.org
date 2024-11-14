'use client'

import { Box } from 'theme-ui'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import { fetchPublishedPreprints } from '../actions'
import type { PublishedPreprint } from '../types/preprint'
import List from './list'
import Grid from './grid'

type ViewType = 'grid' | 'list'
type Props = {
  preprints: PublishedPreprint[]
  nextPage?: string
}

const PreprintsView = (props: Props) => {
  const sentinelRef = useRef<HTMLDivElement>()
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

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && nextPage) {
        handleNextPage()
      }
    },
    [handleNextPage, nextPage],
  )

  useEffect(() => {
    const currentObserver = new IntersectionObserver(handleObserver)
    const currentSentinel = sentinelRef.current

    if (currentSentinel) {
      currentObserver.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        currentObserver.unobserve(currentSentinel)
      }
    }
  }, [handleObserver])

  return (
    <>
      {currentView === 'list' ? (
        <List preprints={preprints} />
      ) : (
        <Grid preprints={preprints} />
      )}

      {nextPage && (
        <Box ref={sentinelRef} sx={{ height: '1px' }} /> // Invisible sentinel
      )}
    </>
  )
}

export default PreprintsView
