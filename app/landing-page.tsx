'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Column, Row, Link } from '../components'
import Topics from './topics'

interface LandingPageProps {
  children?: React.ReactNode
}

type ViewType = 'grid' | 'list'

const LandingPage: React.FC<LandingPageProps> = ({ children }) => {
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
      <Row columns={12} sx={{ mb: [4, 4, 8, 8] }}>
        <Column start={1} width={[10, 10, 3, 3]}>
          <Box as='h1' sx={{ variant: 'text.heading', mb: 4 }}>
            Preprints and Data for Carbon Dioxide Removal
          </Box>
        </Column>

        <Topics />

        <Column start={[7, 7, 1, 1]} width={6}>
          <Flex
            sx={{
              gap: [0, 0, 6, 6],
              justifyContent: 'flex-start',
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box as='h2' sx={{ variant: 'text.monoCaps' }}>
              Recent preprints
            </Box>
            <Flex role='listbox' aria-label='View options' sx={{ gap: 3 }}>
              <Link
                role='option'
                aria-selected={currentView === 'grid'}
                sx={{
                  variant: 'text.body',
                  fontSize: [2, 2, 2, 3],
                  textDecoration: currentView === 'grid' ? 'underline' : 'none',
                  textTransform: 'capitalize',
                }}
                onClick={() => {
                  handleViewChange('grid')
                }}
              >
                Grid
              </Link>
              <Link
                role='option'
                aria-selected={currentView === 'list'}
                sx={{
                  variant: 'text.body',
                  fontSize: [2, 2, 2, 3],
                  textDecoration: currentView === 'list' ? 'underline' : 'none',
                  textTransform: 'capitalize',
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
    </>
  )
}

export default LandingPage
