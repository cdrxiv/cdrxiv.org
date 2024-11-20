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
        error: e.message ?? 'None provided',
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

    return {
      error: e.message ?? 'Error saving changes.',
    }
  }
}
