import { headers } from 'next/headers'
import React from 'react'

import SubmissionsView from './submissions-view'
import { Preprint } from '../../../../types/preprint'
import { fetchWithToken } from '../../../api/utils'

const SubmissionOverview = async () => {
  // const responses = await Promise.all([
  //   fetchWithToken(
  //     headers(),
  //     'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_published',
  //   ),
  //   fetchWithToken(
  //     headers(),
  //     'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_review',
  //   ),
  //   fetchWithToken(
  //     headers(),
  //     'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_rejected',
  //   ),
  // ])

  // if (responses.some((res) => res.status !== 200)) {
  //   redirect('/account?signOut=true')
  // }
  // const [published, review, rejected] = await Promise.all(
  //   responses.map((res) => res.json()),
  // )

  const response = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/',
  )
  if (response.status !== 200) {
  }

  // TODO: remove manual filtering when stage querying is restored
  const results = await response.json()
  const [published, review, rejected] = [
    'preprint_published',
    'preprint_review',
    'preprint_rejected',
  ].map((stage) => results.results.filter((p: Preprint) => p.stage === stage))

  return (
    <SubmissionsView
      published={published}
      review={review}
      rejected={rejected}
    />
  )
}

export default SubmissionOverview
