'use server'

import { fetchWithAlerting } from './server-utils'

export const verify = async (token: string): Promise<boolean> => {
  const response = await fetchWithAlerting(
    'https://api.hcaptcha.com/siteverify',
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        response: token,
        secret: process.env.HCAPTCHA_SECRET as string,
      }),
      method: 'POST',
    },
  )

  const result = await response.json()
  return result.success
}
