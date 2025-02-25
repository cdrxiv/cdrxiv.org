'use client'

import { Box, Flex } from 'theme-ui'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import { fetchPublishedPreprints } from '../actions'
import type { PublishedPreprint } from '../types/preprint'
import { Loading, Link } from '../components'
import List from './list'
import Grid from './grid'

type ViewType = 'grid' | 'list'
type Props = {
  preprints: PublishedPreprint[]
  nextPage?: string
  totalCount?: number
  preprintsPerPage?: number
}

const PreprintsView = (props: Props) => {
  const sentinelRef = useRef<HTMLDivElement>()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('page')
  const currentPageNum = currentPage ? parseInt(currentPage) : 1
  const [nextPage, setNextPage] = useState(props.nextPage)
  const [preprints, setPreprints] = useState(props.preprints)
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      setIsLoading(true)
      fetchPublishedPreprints(nextPage).then((results) => {
        setNextPage(results.next)
        setPreprints((prev) => [...prev, ...results.results])
        setIsLoading(false)
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

  const generatePaginationLinks = () => {
    if (!props.totalCount || !props.preprintsPerPage) return []
    const totalPages = Math.ceil(props.totalCount / props.preprintsPerPage)
    let pages = []

    if (totalPages < 8) {
      pages = Array(totalPages)
        .fill(null)
        .map((d, i) => i + 1)
    } else if (currentPageNum <= 4) {
      pages = [1, 2, 3, 4, 5, 6, '...', totalPages]
    } else if (totalPages - currentPageNum <= 4) {
      pages = [
        1,
        '...',
        ...Array(6)
          .fill(null)
          .map((d, i) => totalPages - 5 + i),
      ]
    } else {
      pages = [
        1,
        '...',
        ...Array(5)
          .fill(null)
          .map((d, i) => currentPageNum - 2 + i),
        '...',
        totalPages,
      ]
    }
    return pages
  }

  const createPageUrl = (page: number) =>
    `?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() })}`

  return (
    <>
      {currentPage && currentPageNum > 1 && (
        <Box
          sx={{
            margin: 'auto',
            mb: 5,
            width: 'fit-content',
          }}
        >
          <Link href={createPageUrl(1)}>View latest preprints</Link>
        </Box>
      )}

      {currentView === 'list' ? (
        <List preprints={preprints} />
      ) : (
        <Grid preprints={preprints} />
      )}

      {isLoading && (
        <Flex sx={{ justifyContent: 'center', mt: 5 }}>
          <Loading />
        </Flex>
      )}

      {nextPage && (
        <Box ref={sentinelRef} sx={{ height: '1px' }} /> // Invisible sentinel
      )}

      {(nextPage || currentPageNum > 1) && (
        <noscript>
          <Flex sx={{ justifyContent: 'center', gap: 2, mt: 5 }}>
            {currentPageNum > 1 && (
              <Link href={createPageUrl(currentPageNum - 1)}>Previous</Link>
            )}
            {generatePaginationLinks().map((page, i) =>
              page === '...' || page === currentPageNum ? (
                <Box as='span' sx={{ mt: '1px' }} key={i}>
                  {page}
                </Box>
              ) : (
                <Link key={i} href={createPageUrl(page as number)}>
                  {page}
                </Link>
              ),
            )}
            {nextPage && (
              <Link href={createPageUrl(currentPageNum + 1)}>Next</Link>
            )}
          </Flex>
        </noscript>
      )}
    </>
  )
}

export default PreprintsView
