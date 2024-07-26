import type { Metadata } from 'next'
import { headers } from 'next/headers'
import ThemeWrapper from '../components/theme-wrapper'
import PageCard from '../components/layouts/page-card'
import PreprintsProvider from '../components/preprints-provider'
import type { Preprints } from '../types/preprint'

async function fetchPreprints(): Promise<Preprints> {
  try {
    const host = headers().get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const apiUrl = `${protocol}://${host}/api/preprints`
    // const cookieHeader = headers().get('cookie') || ''
    const res = await fetch(apiUrl, {
      // headers: {
      //   cookie: cookieHeader,
      // },
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
            <main>
              <PageCard>{children}</PageCard>
            </main>
          </ThemeWrapper>
        </PreprintsProvider>
      </body>
    </html>
  )
}
