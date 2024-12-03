'use client'

import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'
import PaneledPage from '../components/layouts/paneled-page'

const logo = `
.
... 
.....
....... 
......... 
........... 
............. 
............... 
................
..................
....................
......................
........................
..........................
`

const delayFactor = 0.0015

export default function NotFound() {
  const pathname = usePathname()
  return (
    <PaneledPage>
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          mb: 150,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            whiteSpace: 'pre',
            lineHeight: '0.5',
            fontSize: [5, 5, 6, 6],
            display: 'flex',
            flexDirection: 'column',
            '@keyframes fadeOut': {
              from: { opacity: 1 },
              to: { opacity: 0.3 },
            },
            '@keyframes fadeIn': {
              from: { opacity: 0.3 },
              to: { opacity: 1 },
            },
          }}
        >
          {logo.split('\n').map((line, lineIndex) => (
            <Box key={`line-${lineIndex}`}>
              {line.split('').map((char, charIndex) => (
                <Box
                  key={`${lineIndex}-${charIndex}`}
                  sx={{
                    display: 'inline-block',
                    opacity: 1,
                    animation: `fadeOut 0.01s forwards`,
                    animationDelay: `${
                      (lineIndex * line.length + charIndex) * delayFactor
                    }s`,
                  }}
                >
                  {char}
                </Box>
              ))}
            </Box>
          ))}
          <Box
            sx={{
              variant: 'text.monoCaps',
              fontSize: [4, 4, 5, 5],
              mt: 5,
              opacity: 0.3,
              textAlign: 'center',
              animation: 'fadeIn 0.01s  forwards',
              animationDelay: `${
                logo.split('\n').reduce((acc, line) => acc + line.length, 0) *
                delayFactor *
                2
              }s`,
            }}
          >
            {pathname.match(/\/preprint\/\d+/)
              ? 'Preprint not found'
              : 'Page not found'}
          </Box>
        </Box>
      </Flex>
    </PaneledPage>
  )
}
