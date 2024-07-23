import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export const fetchWithToken = async (req: NextRequest, url: string) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
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
