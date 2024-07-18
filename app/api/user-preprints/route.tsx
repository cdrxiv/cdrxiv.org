import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return new Response('Not authenticated', {
      status: 403,
    })
  }

  const res = await fetch(
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/',
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  )
  const data = await res.json()

  if (!data.results) {
    return new Response(data.detail ?? 'Request not completed', {
      status: 403,
    })
  }

  return Response.json(data)
}
