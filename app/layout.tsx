import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'

import '../components/fonts.css'
import PageCard from '../components/layouts/page-card'
import { authOptions } from '../lib/auth'
import { getSubjects } from './api/utils'
import Providers from './providers'
import { SubjectsProvider } from './subjects-context'
import { isFullSiteEnabled } from '../utils/flags'

export const metadata: Metadata = {
  title: 'CDRXIV',
  description:
    'CDRXIV is a new open access platform for sharing preprints and data related to carbon dioxide removal (CDR).',
  icons: {
    icon:
      process.env.VERCEL_ENV === 'production'
        ? '/images/icon.png'
        : '/images/staging-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [subjects, session] = await Promise.all([
    getSubjects(),
    getServerSession(authOptions),
  ])

  return (
    <html lang='en'>
      <head>
        <link
          rel='preload'
          href='https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <Providers session={session}>
          <SubjectsProvider subjects={subjects.results}>
            <main>
              <PageCard>{children}</PageCard>
            </main>
          </SubjectsProvider>
        </Providers>
      </body>
    </html>
  )
}
