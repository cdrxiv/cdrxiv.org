'use client'

import { usePathname } from 'next/navigation'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box } from 'theme-ui'
import useBackgroundColors from '../../hooks/use-background-colors'
import Guide from '../guide'
import Header from '../header'
import MouseTrail from '../mouse-trail'
import PageCorner from '../page-corner'
import SparklyMouseTrail from '../sparkly-mouse-trail'

const margin = [2, 2, 3, 3]

const PageCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>()
  const pathname = usePathname()
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

  return (
    <Box
      sx={{ bg: overallBackground, width: '100vw', height: '100vh' }}
      onClick={handleMouseClick}
    >
      <Box
        sx={{
          m: margin,
          height: (theme) =>
            margin.map(
              (space) =>
                `calc(100vh - 2 * ${theme.space ? theme.space[space] : 0}px)`,
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
            overflow: 'auto',
            bg: cardBackground,
            border: '1px solid',
            borderColor: 'text',
            px: ['18px', '36px', '36px', '52px'],
          }}
        >
          <PageCorner onToggle={toggleTrail} isHomePage={isHomePage} />
          <MouseTrail isActive={isTrailActive && isHomePage} />
          <SparklyMouseTrail isActive={isSuccessfullSubmissionPage} />

          <Box sx={{ contain: 'layout' }}>
            <Guide />
            <Header />
            {children}
          </Box>
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
