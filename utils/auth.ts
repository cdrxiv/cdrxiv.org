import { NextRequest, NextResponse } from 'next/server'
import { encode, getToken, type JWT } from 'next-auth/jwt'

import { fetchWithAlerting } from '../actions/server-utils'

// Borrowed from https://github.com/nextauthjs/next-auth/discussions/6642?sort=top#discussioncomment-9595180

const SIGNIN_SUB_URL = '/account'
const SESSION_TIMEOUT = 60 * 60 * 24 * 30 // 30 days
const TOKEN_REFRESH_BUFFER_SECONDS = 300 // 5 minutes
const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
const SESSION_COOKIE = SESSION_SECURE
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

function shouldUpdateToken(token: JWT): boolean {
  if (!token?.expiresAt) return false

  const timeInSeconds = Math.floor(Date.now() / 1000)
  return timeInSeconds >= token.expiresAt - TOKEN_REFRESH_BUFFER_SECONDS
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const timeInSeconds = Math.floor(Date.now() / 1000)

  try {
    const response = await fetchWithAlerting(
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/o/token/`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.AUTH_CLIENT_ID as string,
          client_secret: process.env.AUTH_CLIENT_SECRET as string,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken as string,
        }),
        method: 'POST',
      },
    )

    const newTokens = await response?.json()

    if (!response?.ok) {
      return token
    }

    return {
      ...token,
      accessToken: newTokens?.access_token ?? token?.accessToken,
      expiresAt: newTokens?.expires_in + timeInSeconds,
      refreshToken: newTokens?.refresh_token ?? token?.refreshToken,
    }
  } catch (e) {
    console.error(e)
  }

  return token
}

function redirectUrl(
  request: NextRequest,
  options: { signOut?: boolean } = {},
) {
  const result = new URL(SIGNIN_SUB_URL, request.url)
  result.searchParams.set('callbackUrl', request.nextUrl.pathname)
  if (options.signOut) {
    result.searchParams.set('signOut', 'true')
  }

  return result
}

function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse,
): NextResponse<unknown> {
  /*
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken && sessionToken !== null) {
    request?.cookies?.set(SESSION_COOKIE, sessionToken)
    response = NextResponse.next({
      request: {
        headers: request?.headers,
      },
    })
    response?.cookies?.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge: SESSION_TIMEOUT,
      secure: SESSION_SECURE,
      sameSite: 'lax',
    })
  } else {
    request?.cookies?.delete(SESSION_COOKIE)
    response = NextResponse.redirect(redirectUrl(request, { signOut: true }))

    return response
  }

  return response
}

export const withAuthAndTokenRefresh = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const token = await getToken({ req: request })
  if (!token) {
    return NextResponse.redirect(redirectUrl(request))
  }

  let response = NextResponse.next()

  if (shouldUpdateToken(token)) {
    try {
      const refreshedToken = await refreshAccessToken(token)

      if (token === refreshedToken) {
        console.error('Error refreshing token')
        return updateCookie(null, request, response)
      }

      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET as string,
        token: refreshedToken,
        maxAge: SESSION_TIMEOUT,
      })

      response = updateCookie(newSessionToken, request, response)
    } catch (error) {
      console.error('Error refreshing token: ', error)

      return updateCookie(null, request, response)
    }
  }

  return response
}
