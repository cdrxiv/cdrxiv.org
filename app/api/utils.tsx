import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { cookies, headers } from 'next/headers'
import { TEST_PREPRINTS, TEST_SUBJECTS } from './placeholder-data'

export const fetchWithToken = async (
  reqOrHeaders: NextRequest | Headers,
  url: string,
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
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  })
  const data = await res.json()
  if (!data.results) {
    return new Response(data.detail ?? 'Request not completed', {
      status: 403,
    })
  }
  return Response.json(data)
}

export const getPreprints = async (reqOrHeaders?: NextRequest | Headers) => {
  const res = await fetchWithToken(
    reqOrHeaders || headers(), // For server components
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/',
  )

  if (res.status === 200) {
    // If authenticated, return actual result
    const result = await res.json()
    return result
  } else {
    // Otherwise, return hardcoded response
    return { ...TEST_PREPRINTS, test_data: true }
  }
}

export const getSubjects = async (reqOrHeaders?: NextRequest | Headers) => {
  const res = await fetchWithToken(
    reqOrHeaders || headers(), // For server components
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/repository_subjects/',
  )

  if (res.status === 200) {
    // If authenticated, return actual result
    const result = await res.json()
    return result
  } else {
    // Otherwise, return hardcoded response
    return { ...TEST_SUBJECTS, test_data: true }
  }
}
