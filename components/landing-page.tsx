'use client'

import React, { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Column from './column'
import Row from './row'
import StyledLink from './link'

import { Subjects } from '../types/subject'
import { useSearchParams, useRouter } from 'next/navigation'
import Menu from './menu'
import type { Preprints } from '../types/preprint'
import PreprintsView from './preprints-view'

interface LandingPageProps {
  preprints: Preprints
  subjects: Subjects
}

type ViewType = 'grid' | 'list'

const LandingPage: React.FC<LandingPageProps> = ({ preprints, subjects }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSubject = searchParams.get('subject') || 'All'
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false)

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams)
    if (newFilter === 'All' || newFilter === currentSubject) {
      params.delete('subject')
    } else {
      params.set('subject', newFilter)
    }
    router.push(`/?${params.toString()}`)
  }

  const midPoint = Math.ceil(subjects.length / 2) - 1 // -1 accounts for All option

  const renderSubject = (name: string) => (
    <Box
      onClick={() => handleFilterChange(name)}
      key={name}
      sx={{
        variant: 'text.body',
        cursor: 'pointer',
        width: 'fit-content',
        bg: currentSubject === name ? 'highlight' : 'transparent',
        mb: '2px',
        ':hover': {
          bg: 'highlight',
        },
      }}
    >
      {name}
    </Box>
  )

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
        <Column start={[1, 1, 5, 5]} width={[6, 6, 8, 8]}>
          <Row columns={8}>
            <Column start={1} width={4}>
              <Box sx={{ variant: 'text.monoCaps', mb: 5 }}>Topics</Box>
            </Column>
          </Row>
          <Row columns={8} sx={{ display: ['none', 'none', 'flex', 'flex'] }}>
            <Column start={1} width={4}>
              {renderSubject('All')}
              {subjects
                .slice(0, midPoint)
                .map((subject) => renderSubject(subject.name))}
            </Column>
            <Column start={5} width={4}>
              {subjects
                .slice(midPoint)
                .map((subject) => renderSubject(subject.name))}
            </Column>
          </Row>

          {/* Mobile */}
          <Row columns={8} sx={{ display: ['flex', 'flex', 'none', 'none'] }}>
            <Column start={1} width={4}>
              <StyledLink
                onClick={() => setSubjectsMenuOpen(true)}
                sx={{
                  variant: 'text.body',
                  fontSize: [2, 2, 2, 3],
                  textDecoration: currentView === 'grid' ? 'underline' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {currentSubject}
              </StyledLink>
            </Column>
          </Row>
        </Column>
        <Column start={[7, 7, 1, 1]} width={6}>
          <Flex
            sx={{
              justifyContent: 'flex-start',
              gap: 6,
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box sx={{ variant: 'text.monoCaps' }}>Recent preprints</Box>
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
      {subjectsMenuOpen && (
        <Menu
          setMenuOpen={setSubjectsMenuOpen}
          sx={{ top: 180, left: 0, height: '50vh', overflowY: 'auto' }}
        >
          {renderSubject('All')}
          {subjects.map((subject) => renderSubject(subject.name))}
        </Menu>
      )}
      <PreprintsView preprints={preprints} />
    </>
  )
}

export default LandingPage
