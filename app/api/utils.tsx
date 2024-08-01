import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { cookies, headers } from 'next/headers'
import { TEST_PREPRINTS, TEST_SUBJECTS } from './placeholder-data'
import { Preprint } from '../../types/preprint'

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

export const getPreprints = async (
  reqOrHeaders?: NextRequest | Headers,
  params?: URLSearchParams,
) => {
  let url =
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/'

  const subject = params?.get('subject')
  if (subject) {
    const queryString = `subject=${subject}`
    url = `${url}?${queryString}`
  }

  const res = await fetchWithToken(
    reqOrHeaders || headers(), // For server components
    url,
  )

  let data
  if (res.status === 200) {
    // If authenticated, use actual result
    data = await res.json()
  } else {
    // Otherwise, use hardcoded response
    data = { ...TEST_PREPRINTS, test_data: true }
  }

  // TODO: remove when this is handled by the Janeway API
  // If subject query provided, manually filter data.results
  if (subject) {
    data.results = data.results.filter((el: Preprint) =>
      el.subject.find((s) => s.name === subject),
    )
  }

  return data
}

export const getSubjects = async (reqOrHeaders?: NextRequest | Headers) => {
  const res = await fetchWithToken(
    reqOrHeaders || headers(), // For server components
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/repository_subjects/',
  )

  if (res.status === 200) {
    // If authenticated, return actual data
    const data = await res.json()
    return data
  } else {
    // Otherwise, return hardcoded response
    return { ...TEST_SUBJECTS, test_data: true }
  }
}
