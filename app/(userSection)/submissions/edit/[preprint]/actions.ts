'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { VersionQueueParams } from '../../../../../types/preprint'
import { fetchWithToken } from '../../../../api/utils'

export async function createVersionQueue(versionQueue: VersionQueueParams) {
  const res = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/version_queue/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(versionQueue),
    },
  )

  if (![200, 201].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to create revision. ${res.statusText}`,
    )
  }

  revalidatePath(`/submissions/edit/${versionQueue.preprint}`)

  const result = res.json()
  return result
}
