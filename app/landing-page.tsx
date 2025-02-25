'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Divider, Flex } from 'theme-ui'
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

  const currentSubject = searchParams.get('subject') || 'All'
  const searchParamsObject: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    searchParamsObject[key] = value
  })

  const createViewUrl = (view: ViewType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    return `/?${params.toString()}`
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

          <Divider
            sx={{ my: 6, display: ['none', 'none', 'inherit', 'inherit'] }}
          />
          <Box variant='text.mono' sx={{ mb: [6, 6, 8, 8] }}>
            CDRXIV is in beta. Help grow this platform by submitting your
            research. You can also send any feedback or questions to{' '}
            <Link variant='text.mono' href='mailto:hello@cdrxiv.org'>
              hello@cdrxiv.org
            </Link>
            .
          </Box>
          <Divider
            sx={{
              mt: 6,
              mb: 8,
              display: ['inherit', 'inherit', 'none', 'none'],
            }}
          />
        </Column>

        <Topics
          currentSubject={currentSubject}
          searchParams={searchParamsObject}
        />

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
                onClick={(e) => {
                  e.preventDefault()
                  handleViewChange('grid')
                }}
                href={createViewUrl('grid')}
                selected={currentView === 'grid'}
                hoverEffect={true}
                sx={{ ':visited': { color: 'blue' } }}
              >
                Grid
              </Link>
              <Link
                role='option'
                aria-selected={currentView === 'list'}
                onClick={(e) => {
                  e.preventDefault()
                  handleViewChange('list')
                }}
                href={createViewUrl('list')}
                selected={currentView === 'list'}
                hoverEffect={true}
                sx={{ ':visited': { color: 'blue' } }}
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
