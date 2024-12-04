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
      <Row columns={[6, 8, 12, 12]} sx={{ mb: [4, 4, 8, 8] }}>
        <Column start={1} width={[6, 8, 3, 3]}>
          <Box
            as='h1'
            sx={{ variant: 'styles.h1', mt: [2, 2, 0, 0], mb: [6, 6, 4, 4] }}
          >
            Preprints&nbsp;and <br />
            Data&nbsp;for&nbsp;Carbon <br />
            Dioxide&nbsp;Removal
          </Box>
        </Column>

        <Topics />

        <Column start={[4, 5, 1, 1]} width={[3, 4, 6, 6]}>
          <Flex
            sx={{
              gap: [1, 1, 6, 6],
              justifyContent: 'flex-start',
              alignItems: 'baseline',
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
