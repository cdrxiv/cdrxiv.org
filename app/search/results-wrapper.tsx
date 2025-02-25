'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Column, Row, ViewSelector, ViewType } from '../../components'

interface ResultsWrapperProps {
  count: number
  search: string
  children?: React.ReactNode
}

const ResultsWrapper: React.FC<ResultsWrapperProps> = ({
  count,
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
            <ViewSelector
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </Flex>
        </Column>
      </Row>
      {children}
    </>
  )
}

export default ResultsWrapper
