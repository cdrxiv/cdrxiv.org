import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

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

  if (res.status !== 200) {
    redirect('/submit/login?signOut=true')
  }

  const data = await res.json()
  let preprint = data.results[0] ?? null

  if (!preprint) {
    preprint = await createPreprint()
  }

  return <PreprintProvider preprint={preprint}>{children}</PreprintProvider>
}

export default SubmissionOverview
