import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import SharedLayout from '../shared-layout'
import PreprintsTable from './preprints-preview-table'
import Forbidden from './forbidden'
import { fetchWithToken } from '../../../actions/server-utils'

const PreviewPage = async () => {
  const session = await getServerSession()
  if (!session?.user.email?.endsWith('@carbonplan.org')) {
    redirect('/account')
  }

  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprints/?stage=preprint_review`,
  )

  if (response.status !== 200) {
    return (
      <SharedLayout title='Preprints Under Review'>
        <Forbidden status={response.status} statusText={response.statusText} />
      </SharedLayout>
    )
  }

  const results = await response.json()

  return (
    <SharedLayout title='Preprints Under Review'>
      <PreprintsTable preprints={results.results} />
    </SharedLayout>
  )
}

export default PreviewPage
