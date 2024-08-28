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
  const [preprintRes, filesRes] = await Promise.all([
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_unsubmitted',
    ),
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/',
    ),
  ])

  let files
  if (preprintRes.status !== 200) {
    redirect('/login?signOut=true')
  } else if (filesRes.status !== 200) {
    // TODO: Remove special handling for /api/preprint_files once non-repository-manager-users can access
    files = { results: [] }
  }

  const [preprintsData, filesData] = await Promise.all([
    preprintRes.json(),
    files ?? filesRes.json(),
  ])
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
