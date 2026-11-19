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
  status: number | string
  statusText: string
  method: string
  apiError?: string
}) {
  // Do not alert in development
  if (process.env.NODE_ENV === 'development') {
    return
  }

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

const PDF_RESPONSE_ERRORS = [
  'MissingPDFException',
  'UnexpectedResponseException',
  'InvalidPDFException',
]

const checkUrl = async (url: string) => {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    await response.body?.cancel()
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (e: any) {
    return { ok: false, status: 'n/a', statusText: e?.message ?? 'unknown' }
  }
}

// Client-side network failures (dropped connections, navigating away, blocked
// worker scripts) are not actionable, so only alert when the server can
// reproduce the failure or pdf.js reports a bad response or invalid file.
export async function alertOnPdfLoadError({
  url,
  name,
  message,
  status,
}: {
  url: string
  name: string
  message: string
  status?: number
}) {
  const janewayUrl = process.env.NEXT_PUBLIC_JANEWAY_URL as string
  if (
    !url.startsWith(janewayUrl) ||
    !/^\/repository\/object\/\d+\/download\/\d+\/?$/.test(
      url.slice(janewayUrl.length),
    )
  ) {
    return
  }

  let statusText = name
  if (!PDF_RESPONSE_ERRORS.includes(name)) {
    const check = await checkUrl(url)
    if (check.ok) return
    status = typeof check.status === 'number' ? check.status : undefined
    statusText = `Server check failed: ${check.statusText}`
  }

  await alertOnError({
    endpoint: url,
    method: 'GET',
    status: status ?? 'n/a',
    statusText,
    apiError: message,
  }).catch((err) => {
    console.error('Failed to send alert to Slack:', err)
  })
}

export const fetchWithAlerting = async (
  url: string,
  options: RequestInit = {},
  expectedStatuses: number[] = [200, 201, 204],
) => {
  // Trigger timeout error if request takes longer than 10 seconds
  // This should ensure that Vercel timeout of 15s [0] is not reached
  //
  // [0] https://vercel.com/docs/functions/configuring-functions/duration
  const interval = setTimeout(() => {
    alertOnError({
      endpoint: url,
      status: 'n/a',
      statusText: 'Timeout (10s exceeded)',
      method: options?.method ?? 'GET',
    })
  }, 10000)
  const response = await fetch(url, options)
  // Clear timeout when response is returned
  clearInterval(interval)

  if (!expectedStatuses.includes(response.status)) {
    let apiError
    try {
      const data = await response.clone().json()
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
    }).catch((err) => {
      console.error('Failed to send alert to Slack:', err)
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
    return new Response('Not authenticated', {
      status: 403,
    })
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
