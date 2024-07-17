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
    backgroundGray: '#F4F5F6',
    mediumGray: '#E3E6E8',
    blue: '#0000FF',
    highlight: '#D2FF39',
    black: '#000',
    white: '#FFFFFF',
    articlePink: '#FD89FF',
    dataGreen: '#74F889',
    visitedPurple: '#8032C7',
  },
}
