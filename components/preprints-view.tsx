'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Flex, Box } from 'theme-ui'
import StyledLink from './link'

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

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    window.history.pushState(null, '', `?${params.toString()}`)
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
          onClick={() => {
            handleViewChange('grid')
          }}
          href={'?view=grid'}
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
          onClick={() => {
            handleViewChange('list')
          }}
          href={'?view=list'}
        >
          List
        </StyledLink>
      </Flex>
      {currentView === 'list' ? (
        <List preprints={preprints} />
      ) : (
        <Grid preprints={preprints} />
      )}
    </>
  )
}

export default PreprintsView
