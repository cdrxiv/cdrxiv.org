import { headers } from 'next/headers'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { fetchWithToken } from '../../api/utils'
import SharedLayout from '../shared-layout'
import PreprintsTable from './preprints-preview-table'
import Forbidden from './forbidden'

const PreviewPage = async () => {
  const session = await getServerSession()
  if (!session?.user.email?.endsWith('@carbonplan.org')) {
    redirect('/account')
  }

  const response = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/?stage=preprint_review',
  )

  let results
  if (response.status !== 200) {
  } else {
    results = await response.json()
  }

  return (
    <SharedLayout title='Preprints under review'>
      {results ? (
        <PreprintsTable preprints={results.results} />
      ) : (
        <Forbidden status={response.status} statusText={response.statusText} />
      )}
    </SharedLayout>
  )
}

export default PreviewPage
