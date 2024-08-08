import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { TEST_SUBJECTS } from './placeholder-data'

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

export const getSubjects = async () => {
  const res = await fetch(
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/repository_subjects/',
    { next: { revalidate: 3600 } },
  )

  if (res.status === 200) {
    return await res.json()
  } else {
    return { ...TEST_SUBJECTS, test_data: true }
  }
}
