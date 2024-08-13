'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Box } from 'theme-ui'
import PaneledPage from '../../../components/layouts/paneled-page'
import StyledLink from '../../../components/link'
import MetadataView from './metadata-view'
import { authorList } from '../../../utils/formatters'
import type { Preprint } from '../../../types/preprint'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PdfViewer = ({ preprint }: { preprint: Preprint }) => {
  const pdfProxyUrl = `/api/pdf/?url=${encodeURIComponent(preprint.versions[0].public_download_url)}`
  const [numPages, setNumPages] = useState(0)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width)
      }
    }
    const resizeObserver = new ResizeObserver(updateWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    updateWidth()
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <PaneledPage
      title={preprint.title}
      sidebar={<> </>} //TODO: try to use <Outline /> here
      metadata={<MetadataView preprint={preprint} />}
    >
      <div ref={containerRef} style={{ width: '100%' }}>
        {preprint.doi && (
          <StyledLink
            href={preprint.doi}
            forwardArrow
            sx={{ variant: 'text.mono' }}
          >
            {preprint.doi}
          </StyledLink>
        )}
        <Box sx={{ variant: 'text.mono', mt: 3, mb: 4 }}>
          {authorList(preprint.authors)}
        </Box>

        <Document
          file={pdfProxyUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {containerWidth > 0 &&
            Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth}
                loading={''}
              />
            ))}
        </Document>
      </div>
    </PaneledPage>
  )
}

export default PdfViewer
