'use server'

import { Deposition, VersionHistory } from '../types/zenodo'
import { fetchWithAlerting } from './server-utils'

const ZENODO_USER_AGENT = 'cdrxiv.org (contact: support@cdrxiv.org)'

// These server actions can be invoked directly with arbitrary arguments, and
// they attach ZENODO_ACCESS_TOKEN to the request. Only allow URLs whose origin
// exactly matches the configured Zenodo instance and that target its API, so
// the token can never be sent to another host. Fails closed if unconfigured.
function assertZenodoApiUrl(url: string): void {
  const zenodoUrl = process.env.NEXT_PUBLIC_ZENODO_URL
  let parsed: URL
  try {
    if (!zenodoUrl) throw new Error('NEXT_PUBLIC_ZENODO_URL is not set')
    parsed = new URL(url)
    if (
      parsed.origin !== new URL(zenodoUrl).origin ||
      !parsed.pathname.startsWith('/api/')
    ) {
      throw new Error()
    }
  } catch {
    throw new Error(`Invalid data URL: ${url}`)
  }
}

export async function createDataDeposition(): Promise<Deposition> {
  const res = await fetchWithAlerting(
    process.env.NEXT_PUBLIC_ZENODO_URL + '/api/deposit/depositions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': ZENODO_USER_AGENT,
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

// Pass `alert: false` when the caller has a fallback for a failed fetch (e.g.
// linking to the public record page) and Slack alerts are not needed.
export async function fetchDataDeposition(
  url: string,
  { alert = true }: { alert?: boolean } = {},
): Promise<Deposition> {
  assertZenodoApiUrl(url)
  const res = await fetchWithAlerting(
    url,
    {
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
        'User-Agent': ZENODO_USER_AGENT,
      },
    },
    undefined,
    { alert },
  )

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
  assertZenodoApiUrl(url)
  const res = await fetchWithAlerting(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': ZENODO_USER_AGENT,
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
  assertZenodoApiUrl(url)

  const res = await fetchWithAlerting(
    url,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
        'User-Agent': ZENODO_USER_AGENT,
      },
    },
    [204, 404],
  )

  // 204: Successful deletion
  // 404: Entity not found (consider it already deleted)
  if (res.status === 204 || res.status === 404) {
    return true
  }

  throw new Error(
    `Status ${res.status}: Unable to delete deposition. ${res.statusText}`,
  )
}

export async function createDataDepositionVersion(
  url: string,
): Promise<Deposition> {
  assertZenodoApiUrl(url)
  const res = await fetchWithAlerting(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'User-Agent': ZENODO_USER_AGENT,
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

export async function fetchDepositionHistory(
  id: number,
): Promise<VersionHistory> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid deposition id: ${id}`)
  }
  const url = `${process.env.NEXT_PUBLIC_ZENODO_URL}/api/records/${id}/versions`

  assertZenodoApiUrl(url)
  const res = await fetchWithAlerting(url, {
    headers: {
      Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
      'User-Agent': ZENODO_USER_AGENT,
    },
  })

  if (res.status !== 200) {
    throw new Error(
      `Status ${res.status}: Unable to fetch deposition version history. ${res.statusText}`,
    )
  }

  const result = await res.json()
  return result
}
