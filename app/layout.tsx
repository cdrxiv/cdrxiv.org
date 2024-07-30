import type { Metadata } from 'next'
import { headers } from 'next/headers'
import ThemeWrapper from '../components/theme-wrapper'
import PageCard from '../components/layouts/page-card'
import PreprintsProvider from '../components/preprints-provider'
import type { Preprints } from '../types/preprint'
import { getPreprints } from './api/utils'

async function fetchPreprints(): Promise<Preprints> {
  try {
    const headersList = headers()
    const data = await getPreprints(headersList)
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
