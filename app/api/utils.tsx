import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { cookies, headers } from 'next/headers'
import { TEST_PREPRINTS } from './placeholder-data'

export const fetchWithToken = async (
  reqOrHeaders: NextRequest | Headers,
  url: string,
  options?: RequestInit,
) => {
  let token
  if (reqOrHeaders instanceof NextRequest) {
    token = await getToken({
      req: reqOrHeaders,
      secret: process.env.NEXTAUTH_SECRET,
    })
  } else {
    // For server components
    const cookieStore = cookies()
    token = await getToken({
      req: {
        headers: reqOrHeaders,
        cookies: cookieStore,
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    })
  }
  if (!token) {
    return new Response('Not authenticated', {
      status: 403,
    })
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token.accessToken}`,
    },
  })

  if (res.status !== 200) {
    return new Response(res.statusText ?? 'Request not completed', {
      status: res.status,
    })
  }
  const data = await res.json()
  return data
}

export const getPreprints = async (reqOrHeaders?: NextRequest | Headers) => {
  const result = await fetchWithToken(
    reqOrHeaders || headers(), // For server components
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/',
  )
  if (result.status === 200) {
    // If authenticated, return actual result
    return result
  } else {
    // Otherwise, return hardcoded response
    return { ...TEST_PREPRINTS, test_data: true }
  }
}
