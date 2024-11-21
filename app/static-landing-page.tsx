'use client'

import React from 'react'
import { Box } from 'theme-ui'
import { Column, Link, Row } from '../components'

const StaticLandingPage = () => {
  return (
    <>
      <Row columns={[6, 8, 12, 12]} sx={{ my: [4, 4, 8, 8] }}>
        <Column start={[1, 1, 2, 2]} width={[6, 6, 5, 5]} sx={{ mb: 9 }}>
          <Box sx={{ variant: 'styles.h1' }} as='h1'>
            Preprints and Data for Carbon Dioxide Removal
          </Box>
        </Column>
        <Column
          start={[1, 1, 2, 2]}
          width={[6, 6, 6, 6]}
          sx={{ mb: [0, 0, 8, 8] }}
        >
          <Box sx={{ variant: 'text.monoCaps', mb: 7 }}>About</Box>
          <Box sx={{ mb: 7 }}>
            CDRXIV is a new open-access platform for sharing preprints and data
            related to carbon dioxide removal (CDR).
          </Box>
          <Box sx={{ mb: 7 }}>
            We are currently accepting submissions, which will be made public
            when CDRXIV launches on December 5th.
          </Box>

          <Box>
            See the <Link href='/about'>about page</Link> for more information
            about CDRXIV, submissions types, and the screening process — and
            reach out to{' '}
            <Link href='mailto:hello@cdrxiv.org'>hello@cdrxiv.org</Link> with
            any questions.
          </Box>
        </Column>
      </Row>
    </>
  )
}

export default StaticLandingPage
