'use server'

import { Deposition, DepositionFile } from '../types/zenodo'

export async function createDataDeposition(): Promise<Deposition> {
  const res = await fetch(
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

  const result = await res.json()
  return result
}

export async function fetchDataDeposition(url: string): Promise<Deposition> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  if (res.status !== 200) {
    throw new Error(
      `Status ${res.status}: Unable to fetch deposition. ${res.statusText}`,
    )
  }

  const result = await res.json()
  return result
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
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (res.status !== 200) {
    throw new Error(
      `Status ${res.status}: Unable to update deposition. ${res.statusText}`,
    )
  }

  const result = await res.json()
  return result
}

export async function deleteZenodoEntity(url: string): Promise<true> {
  if (
    process.env.NEXT_PUBLIC_ZENODO_URL &&
    !url.startsWith(process.env.NEXT_PUBLIC_ZENODO_URL)
  ) {
    throw new Error(`Invalid data URL: ${url}`)
  }

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  if (res.status === 204 || res.status === 404) {
    // 204: Successful deletion
    // 404: Entity not found (consider it already deleted)
    return true
  }

  throw new Error(
    `Status ${res.status}: Unable to delete deposition. ${res.statusText}`,
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
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  if (res.status !== 201) {
    throw new Error(
      `Status ${res.status}: Unable to create new version of deposition. ${res.statusText}`,
    )
  }

  const result = await res.json()
  return result
}
