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
  const responses = await Promise.all([
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_unsubmitted',
    ),
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/',
    ),
  ])

  if (responses.some((res) => res.status !== 200)) {
    redirect('/login?signOut=true')
  }

  const [preprintsData, filesData] = await Promise.all(
    responses.map((res) => res.json()),
  )
  let preprints = preprintsData.results

  if (preprints.length === 0) {
    const preprint = await createPreprint()
    preprints = [preprint]
  }

  return (
    <PreprintProvider preprints={preprints} files={filesData.results}>
      {children}
    </PreprintProvider>
  )
}

export default SubmissionOverview
