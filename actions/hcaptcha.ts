'use server'

export const verify = async (token: string) => {
  const response = await fetch('https://api.hcaptcha.com/siteverify', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      response: token,
      secret: process.env.HCAPTCHA_SECRET as string,
    }),
    method: 'POST',
  })

  const result = await response.json()
  console.log(result)
  return result.success
}
