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
import { Box } from 'theme-ui'
import useBackgroundColors from '../../hooks/use-background-colors'
import Guide from '../guide'
import Header from '../header'
import MouseTrail from '../mouse-trail'
import PageCorner from '../page-corner'
import SparklyMouseTrail from '../sparkly-mouse-trail'
import { isFullSiteEnabled } from '../../utils/flags'

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

const PageCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>()
  const [scrollPosition, setScrollPosition] = useState(0)
  const { cardBackground, overallBackground } = useBackgroundColors()
  const [isTrailActive, setIsTrailActive] = useState(false)

  const pathname = usePathname()
  const isSuccessfullSubmissionPage = pathname.startsWith('/submit/success')
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
          <CardContext.Provider value={contextValue}>
            <PageCorner onToggle={toggleTrail} isHomePage={isHomePage} />
            <MouseTrail
              isActive={isFullSiteEnabled() && isTrailActive && isHomePage}
            />
            <SparklyMouseTrail isActive={isSuccessfullSubmissionPage} />

            <Box sx={{ contain: 'layout' }}>
              <Guide />
              <Header />
              {children}
            </Box>
          </CardContext.Provider>
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
