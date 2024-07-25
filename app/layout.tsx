import type { Metadata } from 'next'
import { headers } from 'next/headers'
import ThemeWrapper from './theme-wrapper'
import PreprintsProvider from '../components/preprints-provider'
import BasicPage from '../components/basic-page'
import { Preprints } from '../types/preprint'

async function fetchPreprints(): Promise<Preprints> {
  try {
    const host = headers().get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const apiUrl = `${protocol}://${host}/api/preprints`
    const cookieHeader = headers().get('cookie') || ''
    const res = await fetch(apiUrl, {
      headers: {
        cookie: cookieHeader,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch preprints')
    const data = await res.json()
    return data.results
  } catch (err) {
    console.error(err)
    return []
  }
}

export const metadata: Metadata = {
  title: 'CDRXIV',
  description: 'CDRXIV',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const preprints = await fetchPreprints()
  return (
    <html lang='en'>
      <body>
        <PreprintsProvider data={preprints}>
          <ThemeWrapper>
            <BasicPage>{children}</BasicPage>
          </ThemeWrapper>
        </PreprintsProvider>
      </body>
    </html>
  )
}
