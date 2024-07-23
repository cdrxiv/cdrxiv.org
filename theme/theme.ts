import type { Theme } from 'theme-ui'
import localFont from 'next/font/local'

const quadrant = localFont({ src: './fonts/QuadrantText-Regular.woff2' })
const pressura = localFont({ src: './fonts/GT-Pressura-Mono-Regular.woff2' })

export const theme: Theme = {
  fonts: {
    body: quadrant.style.fontFamily,
    heading: quadrant.style.fontFamily,
    mono: pressura.style.fontFamily,
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontSize: [4, 5, 5, 6],
    },
    body: {
      fontFamily: 'body',
      fontSize: [2, 2, 2, 3],
    },
    mono: {
      fontFamily: 'mono',
      fontSize: [1, 1, 1, 2],
    },
    monoCaps: {
      fontFamily: 'mono',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      fontSize: [2, 2, 2, 3],
    },
  },
  colors: {
    backgroundGray: '#F4F5F6',
    mediumGray: '#E3E6E8',
    blue: '#0000FF',
    highlight: '#D2FF39',
    black: '#000',
    white: '#FFFFFF',
    articlePink: '#FD89FF',
    dataGreen: '#74F889',
    visitedPurple: '#8032C7',
    bezelGrayDark: '#CECECE',
    bezelGrayLight: '#E8E8E8',
  },
  breakpoints: ['40em', '64em', '102em'],
}
