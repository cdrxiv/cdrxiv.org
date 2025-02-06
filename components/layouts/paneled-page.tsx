'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react'
import { Box, Divider, Flex, ThemeUIStyleObject } from 'theme-ui'
import { usePathname } from 'next/navigation'

import Row from '../row'
import Column from '../column'
import Guide from '../guide'
import Loading from '../loading'
import Expander from '../expander'
import Link from '../link'
import { useCardContext } from './page-card'

const HEADER_HEIGHT = [65, 65, 100, 100]
const FOOTER_HEIGHT = [55, 32, 32, 34]
const PAGE_CARD_MARGIN = [8, 8, 12, 12]

const CANCEL_DELAY = 10000

const LoadingContext = createContext<
  | {
      isLoading: boolean
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
      uploadProgress: {
        article?: number
        data?: number
      }
      setUploadProgress: React.Dispatch<
        React.SetStateAction<{
          article?: number
          data?: number
        }>
      >
      abortController?: AbortController
      setAbortController?: (controller: AbortController | undefined) => void
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

interface ProgressBarProps {
  progress: number
  sx?: any
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, sx }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '0.4em',
        bg: 'muted',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: `${progress}%`,
          height: '100%',
          bg: 'blue',
          transition: 'width 0.3s ease',
        }}
      />
    </Box>
  )
}

const sx: { sticky: ThemeUIStyleObject; expanded: ThemeUIStyleObject } = {
  sticky: {
    height: 'fit-content',
    maxHeight: HEADER_HEIGHT.map(
      (height, i) => `calc(100vh - ${height}px - ${PAGE_CARD_MARGIN[i] * 2}px)`,
    ),
    position: 'sticky',
    top: HEADER_HEIGHT,
    pb: FOOTER_HEIGHT,
    overflowY: 'auto',
    pt: 5,
  },
  expanded: {
    display: ['inherit', 'inherit', 'none', 'none'],
    height: 'fit-content',
    maxHeight: HEADER_HEIGHT.map(
      (height, i) =>
        `calc(100vh - ${height}px - 60px - ${PAGE_CARD_MARGIN[i] * 2}px)`,
    ),
    overflowY: 'auto',
    mr: [-5, -6, 0, 0], // push scrollbar to edge
    pr: [5, 6, 0, 0],
  },
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
  const [uploadProgress, setUploadProgress] = useState<{
    article?: number
    data?: number
  }>({})
  const [abortController, setAbortController] = useState<AbortController>()
  const pathRef = useRef<string | null>(null)
  const pathname = usePathname()
  const { scrollToTop } = useCardContext()
  const [showCancel, setShowCancel] = useState(false)

  useEffect(() => {
    scrollToTop()
    if (pathRef.current !== pathname && isLoading) {
      setIsLoading(false)
      setUploadProgress({})
    }
    pathRef.current = pathname
  }, [pathname, setIsLoading, isLoading, scrollToTop])

  useEffect(() => {
    // cancel if unmounting
    return () => {
      if (abortController) {
        abortController.abort()
        setAbortController(undefined)
      }
    }
  }, [abortController])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isLoading) {
      timeout = setTimeout(() => {
        setShowCancel(true)
      }, CANCEL_DELAY)
    } else {
      setShowCancel(false)
    }
    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleCancel = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(undefined)
      setIsLoading(false)
      setUploadProgress({})
    }
  }, [abortController])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        uploadProgress,
        setUploadProgress,
        abortController,
        setAbortController,
      }}
    >
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
            as='nav'
            aria-label='Section navigation'
            sx={{
              ...sx.sticky,
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
                    position: 'sticky',
                    top: HEADER_HEIGHT,
                    backgroundColor: 'primary',
                    px: [5, 6, 0, 0], // Ensure that metadata renders on top of any full-width content
                    mx: [-5, -6, 0, 0],
                    pt: 4,
                    pb: isSidebarExpanded || isMetadataExpanded ? 2 : 0,
                    zIndex: 3, // Based on react-pdf `Page`'s z-index=2
                  }}
                >
                  <Flex
                    sx={{
                      gap: 5,
                      pb: 4,
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

                  {isSidebarExpanded && <Box sx={sx.expanded}>{sidebar}</Box>}

                  {isMetadataExpanded && (
                    <Box
                      sx={{
                        ...sx.expanded,
                        // Never show metadata on tablet
                        display: ['inherit', 'none', 'none', 'none'],
                      }}
                    >
                      {metadata}
                    </Box>
                  )}

                  {(isSidebarExpanded || isMetadataExpanded) && (
                    <Divider sx={{ mt: 6 }} />
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
                      variant: 'styles.h1',
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
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      {uploadProgress.article === undefined &&
                        uploadProgress.data === undefined && <Loading />}

                      {uploadProgress.article !== undefined && (
                        <Box sx={{ width: '80%', maxWidth: '400px', mb: 4 }}>
                          {uploadProgress.article === 100 ? (
                            <Box sx={{ width: '100%', mb: 2 }}>
                              Article upload complete
                            </Box>
                          ) : (
                            <Loading
                              baseText='Uploading article'
                              sx={{ width: '100%', mb: 2 }}
                            />
                          )}
                          <ProgressBar progress={uploadProgress.article} />
                        </Box>
                      )}
                      {uploadProgress.data !== undefined && (
                        <Box sx={{ width: '80%', maxWidth: '400px' }}>
                          {uploadProgress.data === 100 ? (
                            <Box sx={{ width: '100%', mb: 2 }}>
                              Data upload complete
                            </Box>
                          ) : (
                            <Loading
                              baseText='Uploading data'
                              sx={{ width: '100%', mb: 2 }}
                            />
                          )}
                          <ProgressBar progress={uploadProgress.data} />
                        </Box>
                      )}

                      <Box sx={{ height: 40 }}>
                        {((uploadProgress.article ?? 0) > 0 ||
                          (uploadProgress.data ?? 0) > 0) &&
                          abortController &&
                          showCancel && (
                            <Link
                              sx={{
                                variant: 'text.mono',
                                textDecoration: 'none',
                              }}
                              onClick={handleCancel}
                            >
                              (X) Cancel
                            </Link>
                          )}
                      </Box>
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
              ...sx.sticky,
              mr: [0, -8, -8, -10], // push scrollbar to edge
              pr: [0, 8, 8, 10],
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
