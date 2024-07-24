import type { Metadata } from 'next'
import ThemeWrapper from './theme-wrapper'
import PreprintsProvider from '../components/preprints-provider'
import BasicPage from '../components/basic-page'
import { Preprints } from '../types/preprint'

const API_URL = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`

async function fetchPreprints(): Promise<Preprints> {
  try {
    const res = await fetch(`${API_URL}/api/preprints`)
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
