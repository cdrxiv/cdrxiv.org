'use server'

import { getToken } from 'next-auth/jwt'
import { headers, cookies } from 'next/headers'

export async function catchActionErrors<A extends any[], R>(
  serverAction: (...args: A) => Promise<R>,
  ...args: A
): Promise<{ result: R } | { error: string }> {
  let result
  try {
    result = await serverAction(...args)
    return { result }
  } catch (e: any) {
    return {
      error: e.message ?? 'Error saving changes.',
    }
  }
}

export async function alertOnError({
  endpoint,
  status,
  statusText,
  method,
  apiError,
}: {
  endpoint: string
  status: number
  statusText: string
  method: string
  apiError?: string
}) {
  const token = await getToken({
    req: {
      headers: headers(),
      cookies: cookies(),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  await fetch(process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      status,
      statusText,
      method,
      api_error: apiError,
      user_id: token?.user?.id ?? 'null',
      environment:
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
          ? 'production'
          : 'staging',
      domain:
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
          ? 'cdrxiv.org'
          : 'staging.cdrxiv.org',
    }),
  })
}

export const fetchWithAlerting = async (
  url: string,
  options: RequestInit = {},
  expectedStatuses: number[] = [200, 201, 204],
) => {
  const response = await fetch(url, options)

  if (!expectedStatuses.includes(response.status)) {
    let apiError
    try {
      const data = await response.json()
      apiError = JSON.stringify(data)
    } catch {
      console.warn('Unable to extract error message from response')
    }

    await alertOnError({
      endpoint: url,
      status: response.status,
      statusText: response.statusText,
      method: options?.method ?? 'GET',
      apiError,
    })
  }

  return response
}

export const fetchWithToken = async (
  url: string,
  options: RequestInit = {},
  expectedStatuses?: number[],
) => {
  let token

  token = await getToken({
    req: {
      headers: headers(),
      cookies: cookies(),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    throw new Error('Not authenticated')
  }

  const result = await fetchWithAlerting(
    url,
    {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
    expectedStatuses,
  )

  return result
}
