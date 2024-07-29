'use client'

import { ThemeUIProvider } from 'theme-ui'
import { theme } from '../theme/theme'
import { css, Global } from '@emotion/react'

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeUIProvider theme={theme}>
      <Global
        styles={css`
          @font-face {
            font-family: 'Quadrant Text Regular';
            src: url('https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.woff2')
              format('woff2');
            font-display: swap;
          }

          @font-face {
            font-family: 'GT Pressura Mono Regular';
            src: url('https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.woff2')
              format('woff2');
            font-display: swap;
          }
        `}
      />
      {children}
    </ThemeUIProvider>
  )
}

export default ThemeWrapper
