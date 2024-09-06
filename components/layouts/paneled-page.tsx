'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import { Box, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'
import Loading from '../loading'

const HEADER_HEIGHT = 125

const LoadingContext = createContext<
  | {
      isLoading: boolean
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    }
  | undefined
>(undefined)

const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a PaneledPage')
  }
  return context
}

const PaneledPage: React.FC<{
  children: ReactNode
  metadata?: ReactNode
  sidebar: ReactNode
  title?: string
  leftCorner?: ReactNode
  rightCorner?: ReactNode
}> = ({ children, sidebar, metadata, title, leftCorner, rightCorner }) => {
  const [isLoading, setIsLoading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView()
    }
    if (pathRef.current !== pathname && isLoading) {
      setIsLoading(false)
    }
    pathRef.current = pathname
  }, [pathname, setIsLoading, isLoading])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Row sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <Column
          start={1}
          width={3}
          sx={{
            display: ['none', 'none', 'inherit', 'inherit'],
            overflowY: 'auto',
          }}
        >
          {sidebar}
        </Column>
        <Column
          start={[1, 1, 4, 4]}
          width={[6, 6, 6, 6]}
          sx={{
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'primary',
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
              display: isLoading ? 'flex' : 'none',
            }}
          >
            <Loading />
          </Flex>
          <Box
            ref={contentRef}
            sx={{
              width: '100%',
              background: 'primary',
              px: [0, 0, 6, 8],
              pb: 6,
              display: isLoading ? 'none' : 'inherit',
            }}
          >
            <Box sx={{ contain: 'layout' }}>
              <Guide columns={[6, 6, 8, 8]} color='pink' opacity={0.2} />
              <Row columns={[6, 6, 8, 8]}>
                <Column start={1} width={[6, 6, 8, 8]}>
                  <Flex
                    sx={{
                      width: '100%',
                      justifyContent: 'space-between',
                      display: ['none', 'none', 'flex', 'flex'],
                    }}
                  >
                    <Box sx={{ variant: 'text.monoCaps', mt: 8, mb: 7 }}>
                      {leftCorner}
                    </Box>
                    <Box sx={{ variant: 'text.monoCaps', mt: 8, mb: 7 }}>
                      {rightCorner}
                    </Box>
                  </Flex>

                  <Box as='h1' sx={{ variant: 'text.heading', mb: 7 }}>
                    {title}
                  </Box>

                  {children}
                </Column>
              </Row>
            </Box>
          </Box>
        </Column>
        <Column
          start={[1, 7, 11, 11]}
          width={[6, 2, 2, 2]}
          sx={{
            display: ['none', 'inherit', 'inherit', 'inherit'],
            overflowY: 'auto',
          }}
        >
          {metadata}
        </Column>
      </Row>
    </LoadingContext.Provider>
  )
}

export default PaneledPage
export { useLoading }
