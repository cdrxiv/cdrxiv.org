import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

import { fetchWithToken } from '../../api/utils'
import { PreprintProvider } from './preprint-context'
import { createPreprint } from '../../../actions/preprint'
import { Preprint } from '../../../types/preprint'
import { track } from '@vercel/analytics'

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
  }

  const [preprintsData, filesData] = await Promise.all([
    preprintRes.json(),
    files ?? filesRes.json(),
  ])
  let preprints = preprintsData.results

  // TODO: remove manual filtering when stage querying is restored
  preprints = preprints.filter(
    (p: Preprint) => p.stage === 'preprint_unsubmitted',
  )

  if (preprints.length === 0) {
    const preprint = await createPreprint()
    track('preprint_created', {
      preprint_id: preprint.pk,
      owner: preprint.owner,
    })
    preprints = [preprint]
  }

  return (
    <PreprintProvider preprints={preprints} files={filesData.results}>
      {children}
    </PreprintProvider>
  )
}

export default SubmissionOverview
