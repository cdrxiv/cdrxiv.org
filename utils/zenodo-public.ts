// Unauthenticated reads of published Zenodo records, made from the browser.
//
// These intentionally bypass our server actions: requests come from the
// visitor's network rather than our server's, and no access token is needed.
// Zenodo's public records API allows cross-origin requests. Only published
// records are available here; drafts still require the authenticated server
// actions in `actions/zenodo.ts`.

import type { DepositionVersion, VersionHistory } from '../types/zenodo'

const fetchPublic = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ZENODO_URL}/api${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (res.status !== 200) {
    throw new Error(`Status ${res.status}: Unable to fetch Zenodo ${path}`)
  }
  return res.json()
}

export const fetchPublicRecord = (id: number): Promise<DepositionVersion> =>
  fetchPublic(`/records/${id}`)

export const fetchPublicRecordVersions = (
  id: number,
): Promise<VersionHistory> => fetchPublic(`/records/${id}/versions`)
