import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import PageCard from '../components/layouts/page-card'
import '../components/fonts.css'
import { getSubjects } from './api/utils'
import { SubjectsProvider } from './subjects-context'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'CDRXIV',
  description: 'CDRXIV',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const subjects = await getSubjects()
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
        <script
          defer
          // TODO: Configure production domain
          data-domain='staging.cdrxiv.org'
          src='https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js'
        />
        <script>
          {
            'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }'
          }
        </script>
      </head>
      <body>
        <Providers>
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
