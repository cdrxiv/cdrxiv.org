import type { Metadata } from 'next'
import ThemeWrapper from './theme-wrapper'

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
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  )
}
