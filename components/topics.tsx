'use client'

import React from 'react'
import { Box } from 'theme-ui'
import Column from './column'
import Row from './row'
import { Subjects } from '../types/subject'

const Topics: React.FC<{ subjects: Subjects }> = ({ subjects }) => {
  const midPoint = Math.ceil(subjects.length / 2) - 1

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
            <Box sx={{ variant: 'text.body' }}>All</Box>
            {subjects.slice(0, midPoint).map((subject, index) => (
              <Box
                key={index}
                sx={{
                  variant: 'text.body',
                  cursor: 'pointer',
                  width: 'fit-content',
                  ':hover': {
                    bg: 'highlight',
                  },
                }}
              >
                {subject.name}
              </Box>
            ))}
          </Column>
          <Column start={5} width={4}>
            {subjects.slice(midPoint).map((subject, index) => (
              <Box
                key={index}
                sx={{
                  variant: 'text.body',
                  cursor: 'pointer',
                  width: 'fit-content',
                  ':hover': {
                    bg: 'highlight',
                  },
                }}
              >
                {subject.name}
              </Box>
            ))}
          </Column>
        </Row>
      </Column>
    </Row>
  )
}

export default Topics
