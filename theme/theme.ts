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
  colors: {
    text: '#000',
    background: '#FFFFFF',
    primary: '#000000',
    highlight: '#D2FF39',
    data: '#74F889',
    article: '#FD89FF',
    backgroundGray: '#F4F5F6',
    gray: '#E3E6E8',
    visited: '#8032C7',
    blue: '#0000FF',
  },
}
