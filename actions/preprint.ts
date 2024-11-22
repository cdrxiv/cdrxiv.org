'use server'

import { headers, cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { revalidatePath, revalidateTag } from 'next/cache'
import { sql } from '@vercel/postgres'

import {
  Author,
  AuthorParams,
  Pagination,
  Preprint,
  PreprintParams,
  PreprintFile,
  VersionQueueParams,
} from '../types/preprint'
import { fetchWithAlerting, fetchWithToken } from './server-utils'
import { PREPRINT_BASE } from './constants'

export async function updatePreprint(
  preprint: Preprint,
  params: PreprintParams,
): Promise<Preprint> {
  const { pk, license, ...rest } = preprint

  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/${pk}/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Convert license into PreprintParams format
        license: typeof license === 'number' ? license : license?.pk,
        ...rest,
        ...params,
        repository: process.env.NEXT_PUBLIC_JANEWAY_REPOSITORY,
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

  revalidateTag('submit')

  return updatedPreprint
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
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/`,
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
  revalidateTag('submit')

  return preprint
}

export async function createAuthor(author: AuthorParams): Promise<Author> {
  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/register/`,
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

  const result = await res.json()

  if (result.confirmation_code && result.pk) {
    await sql`INSERT INTO confirmation_codes (account_id, confirmation_code) VALUES (${result.pk}, ${result.confirmation_code});`
  }

  return result
}

export async function searchAuthor(
  search: string,
): Promise<Pagination<Author>> {
  const params = new URLSearchParams({ search })
  const url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/submission_account_search/?${params}`
  const res = await fetchWithToken(url)

  if (res.status !== 200) {
    throw new Error(
      `Status ${res.status}: Unable to search author. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function fetchPreprintFile(pk: number): Promise<PreprintFile> {
  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/${pk}`,
  )

  if (![200].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to fetch file. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function deletePreprintFile(pk: number) {
  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/${pk}`,
    {
      method: 'DELETE',
    },
  )

  if (res.status !== 204) {
    throw new Error(
      `Status ${res.status}: Unable to delete file. ${res.statusText}`,
    )
  }

  revalidateTag('submit')
  return true
}

export async function createVersionQueue(versionQueue: VersionQueueParams) {
  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/version_queue/`,
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

  const result = await res.json()
  return result
}

export async function fetchPublishedPreprints(url: string) {
  const res = await fetchWithAlerting(url)
  if (![200].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to fetch preprints. ${res.statusText}`,
    )
  }

  const result = res.json()
  return result
}

export async function fetchPreprintIdentifier(pk: number) {
  const res = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/identifiers/?preprint_id=${pk}`,
  )

  if (![200].includes(res.status)) {
    throw new Error(
      `Status ${res.status}: Unable to fetch preprints. ${res.statusText}`,
    )
  }

  const result = await res.json()
  return result
}
