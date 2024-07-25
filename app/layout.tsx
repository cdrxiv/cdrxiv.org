import type { Metadata } from 'next'
import ThemeWrapper from './theme-wrapper'
import PageCard from '../components/layouts/page-card'

export const metadata: Metadata = {
  title: 'CDRXIV',
  description: 'CDRXIV',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
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
