'use server'

import { headers, cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { revalidatePath } from 'next/cache'
import {
  Author,
  AuthorParams,
  Pagination,
  Preprint,
  PreprintParams,
  PreprintFile,
  VersionQueueParams,
  SupplementaryFile,
} from '../types/preprint'
import { fetchWithToken } from '../app/api/utils'
import { Deposition } from '../types/zenodo'
import { fetchDataDeposition } from './zenodo'

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
        license: typeof license === 'number' ? license : license?.pk,
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

  // Clear submit form cache when preprint moves from unsubmitted to review stage
  if (
    preprint.stage === 'preprint_unsubmitted' &&
    params.stage === 'preprint_review'
  ) {
    revalidatePath(`/submit`)
  }
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

export async function createAuthor(author: AuthorParams): Promise<Author> {
  const res = await fetchWithToken(
    headers(),
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/accounts/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    },
  )

  if (![200, 201].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to create author. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function searchAuthor(
  search: string,
): Promise<Pagination<Author>> {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/submission_account_search/?search=${search}`,
  )

  if (res.status !== 200) {
    throw new Error(
      `Status ${res.status}: Unable to search author. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function createPreprintFile(
  formData: FormData,
): Promise<PreprintFile> {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (![200, 201].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to create file. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}
export async function fetchPreprintFile(pk: number): Promise<PreprintFile> {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/${pk}`,
  )

  if (![200].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to fetch file. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function deletePreprintFile(pk: number): Promise<true> {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/preprint_files/${pk}`,
    {
      method: 'DELETE',
    },
  )

  if (res.status !== 204) {
    throw new Error(
      `Status ${res.status}: Unable to delete file. ${res.statusText}`,
    )
  }

  return true
}

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

export async function getPublicPreprintAndDeposition(id: string): Promise<{
  preprint: Preprint
  deposition?: Deposition
} | null> {
  const res = await fetch(
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/published_preprints/${id}`,
  )
  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`API request failed with status ${res.status}`)
  }
  const preprint: Preprint = await res.json()
  const dataUrl = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_PUBLISHED',
  )?.url
  let deposition
  if (dataUrl) {
    deposition = await fetchDataDeposition(dataUrl)
  }
  return { preprint, deposition }
}
