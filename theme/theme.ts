import type { Theme } from 'theme-ui'
import localFont from 'next/font/local'

const quadrant = localFont({ src: './fonts/QuadrantText-Regular.woff2' })
const pressura = localFont({ src: './fonts/GT-Pressura-Mono-Regular.woff2' })

export const theme: Theme = {
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 50, 64, 100],
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
      fontSize: [5, 5, 5, 6],
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: [3, 3, 3, 3],
    },
    mono: {
      fontFamily: 'mono',
      fontWeight: 'mono',
      fontSize: [0, 0, 0, 1],
      lineHeight: '130%',
    },
    monoCaps: {
      fontFamily: 'mono',
      fontWeight: 'monoCaps',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      fontSize: [1, 1, 1, 2],
    },
  },
  styles: {
    root: {
      variant: 'text.body',
      background: 'white',
    },
    h1: {
      variant: 'text.heading',
    },
    h2: {
      variant: 'text.heading',
      fontSize: [3, 4, 4, 5],
    },
  },
  forms: {
    input: {
      variant: 'text.body',
      border: '1px solid',
      borderColor: 'transparent',
      boxShadow:
        '1px 1px 0px 1px #c5bbbb inset, -1px -1px 0px 1px #E8E8E8 inset',
      borderRadius: 1,
      background: 'background',
      px: 3,
      width: '100%',
      outline: 'none',
      ':focus': {
        '::placeholder': { color: 'muted' },
        borderColor: 'blue',
      },
    },
    textarea: {
      variant: 'forms.input',
    },
    select: {
      variant: 'forms.input',
    },
    label: {
      variant: 'text.monoCaps',
      fontSize: [1, 1, 1, 2],
    },
  },
  colors: {
    text: '#000',
    background: '#F4F5F6',
    primary: '#FFFFFF',
    muted: '#E3E6E8',
    highlight: '#D2FF39',
    white: '#FFFFFF',
    blue: '#0000FF',
    purple: '#8032C7',
    pink: '#FD89FF',
    green: '#74F889',
    bezelGreyLight: '#E8E8E8',
    bezelGreyDark: '#c5bbbb',
  },
  breakpoints: ['40em', '64em', '102em'],
}
