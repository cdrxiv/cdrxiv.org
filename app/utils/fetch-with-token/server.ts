import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token.accessToken}`,
    },
  })
}
