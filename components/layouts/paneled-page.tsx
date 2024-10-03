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
import { useCardContext } from './page-card'

const HEADER_HEIGHT = [65, 65, 100, 100]

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
  const pathRef = useRef<string | null>(null)
  const pathname = usePathname()
  const { scrollToTop } = useCardContext()

  useEffect(() => {
    scrollToTop()
    if (pathRef.current !== pathname && isLoading) {
      setIsLoading(false)
    }
    pathRef.current = pathname
  }, [pathname, setIsLoading, isLoading, scrollToTop])

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
              maxHeight: HEADER_HEIGHT.map(
                (height) => `calc(100vh - ${height}px)`,
              ),
              position: 'sticky',
              top: HEADER_HEIGHT,
              overflowY: 'auto',
              pl: 3,
              ml: -3,
              mr: [0, 0, -6, -8], // push scrollbar to edge
              pr: [0, 0, 6, 8],
            }}
          >
            {sidebar}
          </Box>
        </Column>
        <Column start={[1, 1, 4, 4]} width={[6, 6, 6, 6]}>
          <Box
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
                        sx={{ display: ['inherit', 'none', 'none', 'none'] }}
                      />
                    )}
                  </Flex>

                  {isSidebarExpanded && (
                    <Box sx={{ position: 'relative', mt: 4, pl: 3, ml: -3 }}>
                      {sidebar}
                    </Box>
                  )}

                  {isMetadataExpanded && (
                    <Box sx={{ display: ['inherit', 'none', 'none', 'none'] }}>
                      {metadata}
                    </Box>
                  )}

                  {(isSidebarExpanded || isMetadataExpanded) && (
                    <Divider sx={{ my: 6 }} />
                  )}
                </Box>
              )}
              <Row columns={[6, 6, 8, 8]}>
                <Column
                  start={1}
                  width={[6, 6, 8, 8]}
                  sx={{ pt: [6, 6, 8, 8] }}
                >
                  {(leftCorner || rightCorner) && (
                    <Flex
                      sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        display: ['none', 'none', 'flex', 'flex'],
                        mb: 7,
                      }}
                    >
                      <Box sx={{ variant: 'text.monoCaps' }}>{leftCorner}</Box>
                      <Box sx={{ variant: 'text.monoCaps' }}>{rightCorner}</Box>
                    </Flex>
                  )}

                  <Box
                    as='h1'
                    sx={{
                      variant: 'text.heading',
                      mt: [0, 0, 5, 5],
                      mb: [6, 6, 7, 7],
                    }}
                  >
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
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: HEADER_HEIGHT,
              maxHeight: HEADER_HEIGHT.map(
                (height) => `calc(100vh - ${height}px)`,
              ),
              overflowY: 'auto',
              mr: [0, 0, -8, -10], // push scrollbar to edge
              pr: [0, 0, 8, 10],
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
