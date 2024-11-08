'use client'

import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

export const fetchWithTokenClient = async (
  url: string,
  options?: RequestInit,
) => {
  const session = (await getSession()) as Session | null

  if (!session?.accessToken) {
    throw new Error('Not authenticated')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${session.accessToken}`,
    },
  })
}
