import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

import SubmissionsView from './submissions-view'
import { fetchWithToken } from '../../../utils/fetch-with-token/server'

const SubmissionOverview = async () => {
  const responses = await Promise.all([
    fetchWithToken(
      headers(),
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/?stage=preprint_published`,
    ),
    fetchWithToken(
      headers(),
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/?stage=preprint_review`,
    ),
    fetchWithToken(
      headers(),
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/?stage=preprint_rejected`,
    ),
  ])

  if (responses.some((res) => res.status !== 200)) {
    redirect('/account?signOut=true')
  }
  const [published, review, rejected] = await Promise.all(
    responses.map((res) => res.json()),
  )

  return (
    <SubmissionsView
      published={published.results}
      review={review.results}
      rejected={rejected.results}
    />
  )
}

export default SubmissionOverview
