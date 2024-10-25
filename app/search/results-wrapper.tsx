'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Column, Row, Link } from '../../components'

interface ResultsWrapperProps {
  count: number
  next: string | null
  previous: string | null
  search: string
  children?: React.ReactNode
}

type ViewType = 'grid' | 'list'

const ResultsWrapper: React.FC<ResultsWrapperProps> = ({
  count,
  next,
  previous,
  search,
  children,
}) => {
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<ViewType>(
    () => (searchParams.get('view') as ViewType) || 'grid',
  )

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <Row columns={[6, 8, 12, 12]} sx={{ mt: 4, mb: [4, 4, 8, 8] }}>
        <Column start={1} width={[6, 8, 8, 8]}>
          <Box sx={{ variant: 'styles.h1', mb: 8 }}>Search for “{search}”</Box>
        </Column>

        <Column start={1} width={6}>
          <Flex
            sx={{
              gap: [0, 0, 6, 6],
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box sx={{ variant: 'text.monoCaps' }}>Results ({count} total)</Box>
            <Flex sx={{ gap: 3 }}>
              <Link
                sx={{
                  fontSize: [2, 2, 2, 3],
                  textDecoration: currentView === 'grid' ? 'underline' : 'none',
                }}
                onClick={() => {
                  handleViewChange('grid')
                }}
              >
                Grid
              </Link>
              <Link
                sx={{
                  fontSize: [2, 2, 2, 3],
                  textDecoration: currentView === 'list' ? 'underline' : 'none',
                }}
                onClick={() => {
                  handleViewChange('list')
                }}
              >
                List
              </Link>
            </Flex>
          </Flex>
        </Column>
      </Row>
      {children}
      {(next || previous) && (
        <Flex sx={{ gap: 3, mt: 3 }}>
          <Link
            sx={{ fontSize: [2, 2, 2, 3] }}
            backArrow
            disabled={!previous}
            href={previous ? `/search${new URL(previous).search}` : '#'}
          >
            Previous
          </Link>
          <Link
            sx={{ fontSize: [2, 2, 2, 3] }}
            forwardArrow
            disabled={!next}
            href={next ? `/search${new URL(next).search}` : '#'}
          >
            Next
          </Link>
        </Flex>
      )}
    </>
  )
}

export default ResultsWrapper
