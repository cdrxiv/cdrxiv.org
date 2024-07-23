'use client'

import { ThemeUIProvider } from 'theme-ui'
import { theme } from '../theme/theme'

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
}

export default ThemeWrapper
