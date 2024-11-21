'use server'

import { Deposition } from '../types/zenodo'
import { fetchWithAlerting } from './server-utils'

export async function createDataDeposition(): Promise<Deposition> {
  const result = await fetchWithAlerting(
    process.env.NEXT_PUBLIC_ZENODO_URL + '/api/deposit/depositions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: {
          upload_type: 'dataset',
          communities: [{ identifier: 'cdrxiv' }],
        },
      }),
    },
  )

  return result.json()
}

export async function fetchDataDeposition(url: string): Promise<Deposition> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }
  const result = await fetchWithAlerting(url, {
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  return result.json()
}

export async function updateDataDeposition(
  url: string,
  params: Partial<Deposition>,
): Promise<Deposition> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }
  const result = await fetchWithAlerting(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  return result.json()
}

export async function deleteZenodoEntity(url: string): Promise<void> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }

  await fetchWithAlerting(
    url,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      },
    },
    // 204: Successful deletion
    // 404: Entity not found (consider it already deleted)
    [204, 404],
  )
}

export async function createDataDepositionVersion(
  url: string,
): Promise<Deposition> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }
  const result = await fetchWithAlerting(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  return result.json()
}
