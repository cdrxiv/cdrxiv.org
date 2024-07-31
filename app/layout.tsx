import type { Metadata } from 'next'
import ThemeWrapper from '../components/theme-wrapper'
import PageCard from '../components/layouts/page-card'
import '../components/fonts.css'

export const metadata: Metadata = {
  title: 'CDRXIV',
  description: 'CDRXIV',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <ThemeWrapper>
          <main>
            <PageCard>{children}</PageCard>
          </main>
        </ThemeWrapper>
      </body>
    </html>
  )
}
