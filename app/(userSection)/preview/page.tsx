import { headers } from 'next/headers'
import React from 'react'

import { fetchWithToken } from '../../api/utils'
import SharedLayout from '../shared-layout'
import PreprintsTable from '../preprints-table'

const PreviewPage = async () => {
  const response = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/?stage=preprint_review',
  )

  if (response.status !== 200) {
  }

  const results = await response.json()

  return (
    <SharedLayout title='Preprints under review'>
      <PreprintsTable
        preprints={results.results}
        date='date_submitted'
        path='/preview'
      />
    </SharedLayout>
  )
}

export default PreviewPage
