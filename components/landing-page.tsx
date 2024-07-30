'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PreprintsView from '../components/preprints-view'
import { Flex, Box } from 'theme-ui'
import StyledLink from '../components/link'

import type { Preprints } from '../types/preprint'

type ViewType = 'grid' | 'list'

function LandingPage({ preprints }: { preprints: Preprints }) {
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

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    const url = new URL(window.location.href)
    url.searchParams.set('view', view)
    window.history.pushState({}, '', url)
  }

  return (
    <>
      <Flex
        sx={{
          my: [4, 4, 8],
          justifyContent: 'flex-start',
          gap: 6,
        }}
      >
        <Box sx={{ variant: 'text.monoCaps' }}>Recent preprints</Box>
        <StyledLink
          sx={{
            variant: 'text.body',
            fontSize: [2, 2, 2, 3],
            textDecoration: currentView === 'grid' ? 'underline' : 'none',
            textTransform: 'capitalize',
          }}
          onClick={(e) => {
            e.preventDefault()
            handleViewChange('grid')
          }}
        >
          Grid
        </StyledLink>
        <StyledLink
          sx={{
            variant: 'text.body',
            fontSize: [2, 2, 2, 3],
            textDecoration: currentView === 'list' ? 'underline' : 'none',
            textTransform: 'capitalize',
          }}
          onClick={(e) => {
            e.preventDefault()
            handleViewChange('list')
          }}
        >
          List
        </StyledLink>
      </Flex>
      <PreprintsView view={currentView} preprints={preprints} />
    </>
  )
}

export default LandingPage
