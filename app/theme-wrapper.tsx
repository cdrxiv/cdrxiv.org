'use client'

import { ThemeUIProvider } from 'theme-ui'
import { theme } from '../theme/theme'

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
}
