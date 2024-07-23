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
  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 400,
    mono: 400,
    monoCaps: 400,
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      fontSize: [4, 5, 5, 6],
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: [1, 1, 1, 2],
    },
    mono: {
      fontFamily: 'mono',
      fontWeight: 'mono',
      fontSize: [1, 1, 1, 2],
      lineHeight: '130%',
    },
    monoCaps: {
      fontFamily: 'mono',
      fontWeight: 'monoCaps',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      fontSize: [2, 2, 2, 3],
    },
  },
  styles: {
    root: {
      variant: 'text.body',
    },
    h1: {
      variant: 'text.heading',
    },
    h2: {
      variant: 'text.heading',
      fontSize: [3, 4, 4, 5],
    },
    h3: {
      variant: 'text.heading',
      fontSize: [2, 3, 3, 4],
    },
    h4: {
      variant: 'text.heading',
      fontSize: [1, 2, 2, 3],
    },
  },
  colors: {
    primary: '#000',
    highlight: '#D2FF39',
    white: '#FFFFFF',
    blue: '#0000FF',
    pink: '#FD89FF',
    green: '#74F889',
    purple: '#8032C7',
    grey: '#F4F5F6',
    mediumGrey: '#E3E6E8',
    bezelGreyLight: '#E8E8E8',
    bezelGreyDark: '#c5bbbb',
  },
  breakpoints: ['40em', '64em', '102em'],
}
