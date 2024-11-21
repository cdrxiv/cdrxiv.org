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

  const result = await fetchWithToken(
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
  const updatedPreprint = await result.json()

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

  const result = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...PREPRINT_BASE, owner: token.user.id }),
    },
  )

  const preprint = await result.json()

  revalidateTag('submit')

  return preprint
}

export async function createAuthor(author: AuthorParams): Promise<Author> {
  const result = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/register/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    },
  )

  const user = await result.json()

  if (user.confirmation_code && user.pk) {
    await sql`INSERT INTO confirmation_codes (account_id, confirmation_code) VALUES (${user.pk}, ${user.confirmation_code});`
  }

  return user
}

export async function searchAuthor(
  search: string,
): Promise<Pagination<Author>> {
  const params = new URLSearchParams({ search })
  const url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/submission_account_search/?${params}`
  const result = await fetchWithToken(url)

  return result.json()
}

export async function fetchPreprintFile(pk: number): Promise<PreprintFile> {
  const result = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/${pk}`,
  )

  return result.json()
}

export async function deletePreprintFile(pk: number) {
  await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/${pk}`,
    {
      method: 'DELETE',
    },
  )

  revalidateTag('submit')
}

export async function createVersionQueue(versionQueue: VersionQueueParams) {
  const result = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/version_queue/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(versionQueue),
    },
  )

  revalidatePath(`/submissions/edit/${versionQueue.preprint}`)

  return result.json()
}

export async function fetchPublishedPreprints(url: string) {
  const result = await fetchWithAlerting(url)
  return result
}

export async function fetchPreprintIdentifier(pk: number) {
  const result = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/identifiers/?preprint_id=${pk}`,
  )

  return result.json()
}

export const fetchRepositorySubjects = async () => {
  const result = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/repository_subjects/`,
    { next: { revalidate: 180 } },
  )

  return result.json()
}
