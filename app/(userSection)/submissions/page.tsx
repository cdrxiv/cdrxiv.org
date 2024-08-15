import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

import SubmissionsView from './submissions-view'
import { fetchWithToken } from '../../api/utils'

interface Props {
  children: React.ReactNode
}
const SubmissionOverview: React.FC<Props> = async ({ children }) => {
  const responses = await Promise.all([
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_published',
    ),
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_review',
    ),
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_rejected',
    ),
  ])

  if (responses.some((res) => res.status !== 200)) {
    redirect('/login?signOut=true')
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
