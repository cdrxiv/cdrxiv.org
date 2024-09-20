import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'

import '../components/fonts.css'
import PageCard from '../components/layouts/page-card'
import Providers from './providers'
import { getSubjects } from './api/utils'
import { SubjectsProvider } from './subjects-context'
import { authOptions } from '../lib/auth'
import  MouseTrail from '../components/mouse-trail'

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
      </body>
    </html>
  )
}
