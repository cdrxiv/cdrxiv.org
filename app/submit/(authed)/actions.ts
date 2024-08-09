'use server'

import { headers, cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { Preprint, PreprintParams } from '../../../types/preprint'
import { fetchWithToken } from '../../api/utils'

export async function updatePreprint(
  preprint: Preprint,
  params: PreprintParams,
): Promise<Preprint> {
  const { pk, license, ...rest } = preprint

  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/${pk}/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Convert license into PreprintParams format
        license: license?.pk,
        ...rest,
        ...params,
        repository: 1,
      }),
    },
  )

  if (res.status !== 200) {
    let keyErrors
    try {
      const data = await res.json()
      keyErrors = Object.keys(data).map(
        (key) => `${key} (${data[key].join(', ')})`,
      )
    } catch {
      console.warn('Unable to extract error message from response')
    }
    throw new Error(
      keyErrors
        ? `Status ${res.status}: Unable to update preprint. Error updating field(s): ${keyErrors.join('; ')}.`
        : `Status ${res.status}: Unable to update preprint ${pk}. ${res.statusText}`,
    )
  }

  const updatedPreprint = res.json()
  return updatedPreprint
}

const PREPRINT_BASE = {
  title: 'Placeholder',
  abstract: null,
  stage: 'preprint_unsubmitted',
  license: null,
  keywords: [],
  date_submitted: null,
  date_accepted: null,
  date_published: null,
  doi: null,
  preprint_doi: null,
  authors: [],
  subject: [],
  versions: [],
  supplementary_files: [],
  additional_field_answers: [],
  repository: 1,
}

export async function createPreprint(): Promise<Preprint> {
  const token = await getToken({
    req: {
      headers: headers(),
      cookies: cookies(),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.user?.id) {
    throw new Error('Tried to createPreprint() without authenticating')
  }

  const res = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...PREPRINT_BASE, owner: token.user.id }),
    },
  )

  if (![200, 201].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to create preprint. ${res.statusText}`,
    )
  }

  const preprint = res.json()
  return preprint
}
