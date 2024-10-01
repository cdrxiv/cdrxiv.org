import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

import { fetchWithToken } from '../api/utils'
import { PreprintProvider } from './preprint-context'
import { createPreprint } from '../../actions/preprint'
import SubmitLayout from './submit-layout'

interface Props {
  children: React.ReactNode
}

export const metadata = {
  title: 'Submit – CDRXIV',
}

const SubmissionOverview: React.FC<Props> = async ({ children }) => {
  const [preprintRes, filesRes] = await Promise.all([
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/?stage=preprint_unsubmitted',
      { next: { tags: ['submit'] } },
    ),
    fetchWithToken(
      headers(),
      'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/',
      { next: { tags: ['submit'] } },
    ),
  ])

  let files
  if (preprintRes.status !== 200) {
    redirect('/account?signOut=true&callbackUrl=/submit/overview')
  }

  const [preprintsData, filesData] = await Promise.all([
    preprintRes.json(),
    files ?? filesRes.json(),
  ])
  let preprints = preprintsData.results

  let preprintCreated = false
  if (preprints.length === 0) {
    const preprint = await createPreprint()
    preprintCreated = true
    preprints = [preprint]
  }

  return (
    <PreprintProvider
      preprints={preprints}
      files={filesData.results}
      newlyCreated={preprintCreated}
    >
      <SubmitLayout>{children}</SubmitLayout>
    </PreprintProvider>
  )
}

export default SubmissionOverview
