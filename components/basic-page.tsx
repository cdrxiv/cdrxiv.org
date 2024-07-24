'use client'

import React from 'react'
import { Box, Flex } from 'theme-ui'
import Header from './header'
import Row from './row'
import Column from './column'
import StyledLink from './link'

const margin = 12

const BasicPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        m: `${margin}px`,
        height: `calc(100vh - 2 * ${margin}px)`,
        position: 'fixed',
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          bg: 'backgroundGray',
          px: 2,
          borderLeft: '1px solid',
          borderBottom: '1px solid',
          borderRight: '1px solid',
          borderColor: 'black',
        }}
      >
        <Header />
        <Row columns={[12]} gap={4} sx={{ mt: 6 }}>
          <Column start={1} width={3}>
            <Box sx={{ variant: 'text.heading' }}>
              Preprints and Data for Carbon Dioxide Removal
            </Box>
          </Column>
          <Column start={5} width={8}>
            <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Topics</Box>
            <Box sx={{ variant: 'text.body' }}>All</Box>
            <Box sx={{ variant: 'text.body' }}>
              Alkaline waste mineralization
            </Box>
            <Box sx={{ variant: 'text.body' }}>Direct air capture</Box>
          </Column>
        </Row>
        <Row columns={[12]} gap={4} sx={{ mt: 3 }}>
          <Column start={1} width={4}>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ variant: 'text.monoCaps' }}>Recent Preprints</Box>
              <StyledLink href='/stack'>Stack</StyledLink>
              <StyledLink href='/grid'>Grid</StyledLink>
              <StyledLink href='/list'>List</StyledLink>
            </Flex>
          </Column>
        </Row>
        <Box sx={{ mt: 100 }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default BasicPage
