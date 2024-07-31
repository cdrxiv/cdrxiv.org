'use client'

import React from 'react'
import { Box, Flex } from 'theme-ui'
import Column from './column'
import Row from './row'

const Topics: React.FC = () => {
  return (
    <Row sx={{ mt: 4 }}>
      <Column start={1} width={3}>
        <Box sx={{ variant: 'text.heading' }}>
          Preprints and Data for Carbon Dioxide Removal
        </Box>
      </Column>
      <Column start={5} width={8}>
        <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Topics</Box>
        <Box sx={{ variant: 'text.body' }}>All</Box>
        <Box sx={{ variant: 'text.body' }}>Alkaline waste mineralization</Box>
        <Box sx={{ variant: 'text.body' }}>Direct air capture</Box>
      </Column>
    </Row>
  )
}

export default Topics
