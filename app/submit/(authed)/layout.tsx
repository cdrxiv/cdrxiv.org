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
    redirect('/login?signOut=true')
  }

  const data = await res.json()
  let preprints = data.results

  if (preprints.length === 0) {
    const preprint = await createPreprint()
    preprints = [preprint]
  }

  return <PreprintProvider preprints={preprints}>{children}</PreprintProvider>
}

export default SubmissionOverview
