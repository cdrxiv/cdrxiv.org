'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import { Box, Divider, Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'
import Loading from '../loading'
import Expander from '../expander'

const HEADER_HEIGHT = 100

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
  sidebar?: ReactNode
  title?: string
  leftCorner?: ReactNode
  rightCorner?: ReactNode
}> = ({ children, sidebar, metadata, title, leftCorner, rightCorner }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false)
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
      <Row>
        <Column
          start={1}
          width={3}
          sx={{
            display: ['none', 'none', 'inherit', 'inherit'],
            height: '100%',
          }}
        >
          <Box
            sx={{
              height: 'fit-content',
              maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              position: 'sticky',
              top: HEADER_HEIGHT,
              overflowY: 'auto',
              pl: 3,
              ml: -3,
              mr: [0, 0, -6, -8], // push scrollbar to edge
              pr: [0, 0, -6, -8],
            }}
          >
            {sidebar}
          </Box>
        </Column>
        <Column start={[1, 1, 4, 4]} width={[6, 6, 6, 6]}>
          <Box
            ref={contentRef}
            sx={{
              width: '100%',
              background: 'primary',
              px: [0, 0, 6, 8],
              pb: 6,
            }}
          >
            <Box sx={{ contain: 'layout' }}>
              <Guide columns={[6, 6, 8, 8]} color='pink' opacity={0.2} />
              {(sidebar || metadata) && (
                <Box
                  sx={{
                    display: ['inherit', 'inherit', 'none', 'none'],
                  }}
                >
                  <Flex
                    sx={{
                      gap: 5,
                      pt: 4,
                      mb: 4,
                    }}
                  >
                    {sidebar && (
                      <Expander
                        label='Overview'
                        expanded={isSidebarExpanded}
                        setExpanded={(value) => {
                          setIsSidebarExpanded(value)
                          value && setIsMetadataExpanded(false)
                        }}
                      />
                    )}

                    {metadata && (
                      <Expander
                        label='More info'
                        expanded={isMetadataExpanded}
                        setExpanded={(value) => {
                          setIsMetadataExpanded(value)
                          value && setIsSidebarExpanded(false)
                        }}
                      />
                    )}
                  </Flex>

                  {isSidebarExpanded && (
                    <Box sx={{ position: 'relative', pl: 3, ml: -3 }}>
                      {sidebar}
                    </Box>
                  )}

                  {isMetadataExpanded && metadata}

                  {(isSidebarExpanded || isMetadataExpanded) && (
                    <Divider sx={{ my: 6 }} />
                  )}
                </Box>
              )}
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
                  {isLoading && (
                    <Flex
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '100%',
                        zIndex: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'primary',
                      }}
                    >
                      <Loading />
                    </Flex>
                  )}

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
            height: '100%',
          }}
        >
          <Box
            sx={{
              height: 'fit-content',
              position: 'sticky',
              top: HEADER_HEIGHT,
              maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              overflowY: 'auto',
              mr: [0, 0, -8, -10], // push scrollbar to edge
              pr: [0, 0, -8, -10],
            }}
          >
            {metadata}
          </Box>
        </Column>
      </Row>
    </LoadingContext.Provider>
  )
}

export default PaneledPage
export { useLoading }
