'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import Column from './column'
import Row from './row'
import StyledLink from './link'
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
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <Row columns={12} sx={{ mt: 4, mb: 6 }}>
        <Column start={1} width={[10, 10, 3, 3]}>
          <Box sx={{ variant: 'text.heading', mb: 4 }}>
            Preprints and Data for Carbon Dioxide Removal
          </Box>
        </Column>

        <Topics />

        <Column start={[7, 7, 1, 1]} width={6}>
          <Flex
            sx={{
              justifyContent: 'flex-start',
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Recent preprints</Box>
            <Flex sx={{ gap: 3 }}>
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
          </Flex>
        </Column>
      </Row>
      {children}
    </>
  )
}

export default LandingPage
