'use client'

import React from 'react'
import { Box } from 'theme-ui'
import Column from './column'
import Row from './row'
import { Subjects } from '../types/subject'
import { useSearchParams, useRouter } from 'next/navigation'

interface TopicsProps {
  subjects: Subjects
}

const Topics: React.FC<TopicsProps> = ({ subjects }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSubject = searchParams.get('subject') || 'All'

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
  return (
    <Row sx={{ mt: 4 }}>
      <Column start={1} width={3}>
        <Box sx={{ variant: 'text.heading' }}>
          Preprints and Data for Carbon Dioxide Removal
        </Box>
      </Column>
      <Column start={5} width={8}>
        <Row columns={8}>
          <Column start={1} width={4}>
            <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Topics</Box>
          </Column>
        </Row>
        <Row columns={8}>
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
      </Column>
    </Row>
  )
}

export default Topics
