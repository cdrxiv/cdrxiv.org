'use client'

import React from 'react'
import { Box } from 'theme-ui'
import { Column, Link, Row } from '../components'

const StaticLandingPage = () => {
  return (
    <>
      <Row columns={[6, 8, 12, 12]} sx={{ mb: [4, 4, 8, 8] }}>
        <Column start={[1, 1, 2, 2]} width={[6, 6, 5, 5]} sx={{ mb: 9 }}>
          <Box sx={{ variant: 'text.heading' }}>
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
            related to carbon dioxide removal (CDR).{' '}
            <Link href='https://carbonplan.org/'>CarbonPlan</Link> is leading
            the development with input from other collaborating organizations.
          </Box>

          <Box>
            We are now accepting pre-submissions. If you’re interested in
            submitting a CDR preprint article and/or data, email{' '}
            <Link href='mailto:hello@cdrxiv.org'>hello@cdrxiv.org</Link> with
            the subject “Pre-Submission.”
          </Box>
        </Column>
      </Row>
    </>
  )
}

export default StaticLandingPage
