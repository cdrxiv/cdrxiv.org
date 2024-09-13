import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import PageCard from '../components/layouts/page-card'
import '../components/fonts.css'
import { getSubjects } from './api/utils'
import { SubjectsProvider } from './subjects-context'
import Providers from './providers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'

export const metadata: Metadata = {
  title: 'CDRXIV',
  description: 'CDRXIV',
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
        <Analytics />
      </body>
    </html>
  )
}
