'use server'

import { Deposition, DepositionFile } from '../types/zenodo'

export async function createDataDeposition(): Promise<Deposition> {
  const res = await fetch(process.env.ZENODO_URL + '/api/deposit/depositions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ metadata: { upload_type: 'dataset' } }),
  })

  const result = await res.json()
  return result
}

export async function fetchDataDeposition(url: string): Promise<Deposition> {
  if (process.env.ZENODO_URL && !url.startsWith(process.env.ZENODO_URL)) {
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
  if (process.env.ZENODO_URL && !url.startsWith(process.env.ZENODO_URL)) {
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
  if (process.env.ZENODO_URL && !url.startsWith(process.env.ZENODO_URL)) {
    throw new Error(`Invalid data URL: ${url}`)
  }

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
    },
  })

  if (res.status !== 204) {
    throw new Error(
      `Status ${res.status}: Unable to delete deposition. ${res.statusText}`,
    )
  }

  return true
}

export async function createDataDepositionFile(
  deposition: number,
  formData: FormData,
): Promise<DepositionFile> {
  const res = await fetch(
    process.env.ZENODO_URL + `/api/deposit/depositions/${deposition}/files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      },
      body: formData,
    },
  )

  const result = await res.json()

  if (!result.id) {
    throw new Error(result.message ?? 'Unable to create deposition file.')
  }

  return result
}
