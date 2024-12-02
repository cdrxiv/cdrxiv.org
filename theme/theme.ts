import type { Theme } from 'theme-ui'

export const theme: Theme = {
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 50, 64, 100],
  fonts: {
    body: 'Quadrant Text Regular',
    heading: 'Quadrant Text Regular',
    mono: 'GT Pressura Mono Regular',
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 400,
    mono: 400,
    monoCaps: 400,
  },
  lineHeights: {
    body: 1.5,
    heading: 1,
    mono: 1.3,
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: [2, 2, 2, 3],
    },
    mono: {
      fontFamily: 'mono',
      fontWeight: 'mono',
      lineHeight: 'mono',
      fontSize: [0, 0, 0, 1],
    },
    monoCaps: {
      fontFamily: 'mono',
      fontWeight: 'monoCaps',
      lineHeight: 'mono',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      fontSize: [0, 0, 1, 2],
    },
  },
  styles: {
    root: {
      variant: 'text.body',
      background: 'white',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontSynthesis: 'none',
    },
    h1: {
      variant: 'text.heading',
      fontSize: [5, 5, 5, 6],
    },
    h2: {
      variant: 'text.heading',
      fontSize: [2, 2, 3, 4],
    },
    h3: {
      variant: 'text.heading',
      fontSize: [2, 2, 3, 3],
    },
    a: {
      variant: 'text.body',
      color: 'blue',
      ':visited': { color: 'purple' },
      cursor: 'pointer',
      background: 'none',
      border: '1px solid',
      borderColor: 'transparent',
      outline: 'none',
      ':focus-visible': {
        borderColor: 'blue',
      },
      padding: 0,
      textDecoration: 'underline',
    },
    ul: { padding: 0, listStyle: 'none' },
    li: {
      padding: 0,
      listStyle: 'none',
      '&::before': {
        fontFamily: 'mono',
        fontWeight: 'mono',
        fontSize: [0, 0, 0, 1],
        lineHeight: '130%',
        color: 'blue',
        content: '"> "',
      },
    },
    error: {
      variant: 'text.mono',
      color: 'red',
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
      minHeight: '61px',
      resize: 'vertical',
    },
    select: {
      variant: 'forms.input',
    },
    label: {
      cursor: 'pointer',
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
    listBorderGrey: '#888',
  },
  breakpoints: ['40em', '64em', '102em'],
}
