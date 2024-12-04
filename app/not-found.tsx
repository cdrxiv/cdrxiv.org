'use client'

import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

const delayFactor = 0.0015

export default function NotFound() {
  const pathname = usePathname()
  return (
    <>
      <title>404 - CDRXIV</title>
      <Flex
        variant='text.monoCaps'
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Flex
          sx={{
            gap: '2px',
            lineHeight: 1,
            fontSize: [2, 2, 3, 3],
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
          {Array(14)
            .fill(null)
            .map((_, lineIndex) => (
              <Flex key={lineIndex}>
                {Array(1 + lineIndex * 2)
                  .fill(null)
                  .map((_, charIndex) => (
                    <Box
                      key={charIndex}
                      sx={{
                        opacity: 1,
                        animation: `fadeOut 0.01s forwards`,
                        animationDelay: `${
                          (lineIndex * (1 + lineIndex * 2) + charIndex) *
                          delayFactor
                        }s`,
                      }}
                    >
                      {charIndex % 2 === 0 ? '4' : '0'}
                    </Box>
                  ))}
              </Flex>
            ))}
        </Flex>
        <Box
          sx={{
            fontSize: 4,
            mt: 4,
            opacity: 0.3,
            textAlign: 'center',
            animation: 'fadeIn 0.01s forwards',
            animationDelay: `${(13 * 27 + 26) * delayFactor}s`,
          }}
        >
          {pathname.match(/\/preprint\/\d+/)
            ? 'Preprint not found'
            : 'Page not found'}
        </Box>
      </Flex>
    </>
  )
}
