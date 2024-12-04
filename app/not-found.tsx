'use client'

import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

const logo = `
4
404
40404
4040404
404040404
40404040404
4040404040404
404040404040404
4040404040404040
404040404040404040
40404040404040404040
4040404040404040404040
404040404040404040404040
40404040404040404040404040
`

const delayFactor = 0.0015

export default function NotFound() {
  const pathname = usePathname()
  return (
    <>
      <title>Not Found - CDRXIV</title>
      <Flex
        variant='text.mono'
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          mb: 150,
          flexDirection: 'column',
          display: 'flex',
          height: '70vh',
        }}
      >
        <Box
          sx={{
            whiteSpace: 'pre',
            lineHeight: 1,
            fontSize: [2, 2, 3, 3],
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
              fontSize: 4,
              mt: 2,
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
    </>
  )
}
