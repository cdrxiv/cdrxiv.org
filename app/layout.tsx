import type { Metadata } from 'next'
import ThemeWrapper from './theme-wrapper'
import BasicPage from '../components/basic-page'

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
            <BasicPage>{children}</BasicPage>
          </main>
        </ThemeWrapper>
      </body>
    </html>
  )
}
