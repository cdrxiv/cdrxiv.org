'use client'

import { usePathname } from 'next/navigation'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Box, Flex } from 'theme-ui'
import useBackgroundColors from '../../hooks/use-background-colors'
import Guide from '../guide'
import Header from '../header'
import Link from '../link'
import MouseTrail from '../mouse-trail'
import PageCorner from '../page-corner'
import SparklyMouseTrail from '../sparkly-mouse-trail'

const margin = [2, 2, 3, 3]

const CardContext = createContext<{
  scrollToTop: () => void
}>({ scrollToTop: () => {} })

export const useCardContext = () => {
  const context = useContext(CardContext)
  if (context === undefined) {
    throw new Error('useCardContext must be used within a PageCard')
  }
  return context
}

const sx = {
  footer: {
    variant: 'text.mono',
  },
}
const PageCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>()
  const [scrollPosition, setScrollPosition] = useState(0)
  const { cardBackground, overallBackground } = useBackgroundColors()
  const [isTrailActive, setIsTrailActive] = useState(false)

  const pathname = usePathname()
  const isSuccessfulSubmissionPage = pathname.startsWith('/submit/success')
  const isHomePage = pathname === '/' || pathname.startsWith('/?')

  const toggleTrail = useCallback(() => {
    if (isHomePage) {
      setIsTrailActive((prev) => !prev)
    }
  }, [isHomePage])

  const handleMouseClick = useCallback(() => {
    if (isTrailActive) {
      setIsTrailActive(false)
    }
  }, [isTrailActive])

  const showProgressBar = pathname.match(/\/preprint\/\d+/)
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const totalHeight = ref.current.scrollHeight - ref.current.clientHeight
        if (totalHeight > 500) {
          setScrollPosition(ref.current.scrollTop / totalHeight)
        } else {
          setScrollPosition(0)
        }
      }
    }

    if (showProgressBar && ref.current) {
      const container = ref.current
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [showProgressBar])

  const contextValue = useMemo(() => {
    return {
      scrollToTop: () => {
        if (ref.current) {
          ref.current.scrollTo(0, 0)
        }
      },
    }
  }, [])

  return (
    <Box
      sx={{ bg: overallBackground, width: '100vw', height: '100dvh' }}
      onClick={handleMouseClick}
    >
      <Box
        sx={{
          m: margin,
          height: (theme) =>
            margin.map(
              (space) =>
                `calc(100dvh - 2 * ${theme.space ? theme.space[space] : 0}px)`,
            ),
          width: (theme) =>
            margin.map(
              (space) =>
                `calc(100vw - 2 * ${theme.space ? theme.space[space] : 0}px)`,
            ),
          position: 'fixed',
        }}
      >
        <Box
          ref={ref}
          sx={{
            height: '100%',
            overflowY: 'scroll',
            bg: cardBackground,
            border: '1px solid',
            borderColor: 'text',
            px: ['18px', '36px', '36px', '52px'],
          }}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              height: '100%',
              gap: 5,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <CardContext.Provider value={contextValue}>
                <PageCorner onToggle={toggleTrail} isHomePage={isHomePage} />
                {isTrailActive && isHomePage && <MouseTrail />}
                {isSuccessfulSubmissionPage && <SparklyMouseTrail />}

                <Box sx={{ contain: 'layout' }}>
                  <Guide />
                  <Header />
                  {children}
                </Box>
              </CardContext.Provider>
            </Box>

            <Flex
              sx={{ columnGap: 3, rowGap: 2, flexWrap: 'wrap', pb: '14px' }}
            >
              <Box sx={{ ...sx.footer, flexBasis: ['100%', 'inherit'] }}>
                Powered by Janeway
              </Box>
              <Link href='/terms-of-use' sx={sx.footer}>
                Terms of Use
              </Link>
              <Link href='/privacy-policy' sx={sx.footer}>
                Privacy Policy
              </Link>
              <Link href='/cookies-notice' sx={sx.footer}>
                Cookies Notice
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Box>
      {showProgressBar && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            ml: margin,
            width: (theme) =>
              margin.map(
                (space) =>
                  `calc(${scrollPosition} * (100vw - 2 * ${theme.space ? theme.space[space] : 0}px))`,
              ),
            height: (theme) =>
              margin.map(
                (space) => `${theme.space ? theme.space[space] : 0}px`,
              ),
            backgroundColor: 'blue',
          }}
        />
      )}
    </Box>
  )
}

export default PageCard
