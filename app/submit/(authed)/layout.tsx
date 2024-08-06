import { headers } from 'next/headers'
import React from 'react'

import { fetchWithToken } from '../../api/utils'
import { PreprintProvider } from './preprint-context'
import { createPreprint } from './actions'

interface Props {
  children: React.ReactNode
}
const SubmissionOverview: React.FC<Props> = async ({ children }) => {
  const res = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_unsubmitted',
  )

  let preprint = res.results[0] ?? null

  if (!preprint) {
    await createPreprint()
    const secondRes = await fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_unsubmitted',
    )
    preprint = secondRes.results[0] ?? null
  }

  return <PreprintProvider preprint={preprint}>{children}</PreprintProvider>
}

export default SubmissionOverview
