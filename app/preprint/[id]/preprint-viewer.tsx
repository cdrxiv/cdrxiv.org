'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Box } from 'theme-ui'
import PaneledPage from '../../../components/layouts/paneled-page'
import StyledLink from '../../../components/link'
import MetadataView from './metadata-view'
import Outline from './outline'
import { authorList } from '../../../utils/formatters'
import { getAdditionalField } from '../../../utils/data'

import type { Preprint } from '../../../types/preprint'
import type { Deposition } from '../../../types/zenodo'
import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PreprintViewer = ({
  preprint,
  deposition,
}: {
  preprint: Preprint
  deposition?: Deposition
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')

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

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy): void => {
    setPdf(pdf)
  }

  const onItemClicked = ({ pageNumber }: { pageNumber: number }) => {
    const pageRef = pageRefs.current[pageNumber - 1]
    if (pageRef) {
      pageRef.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <PaneledPage
      title={preprint.title}
      sidebar={pdf ? <Outline pdf={pdf} onItemClick={onItemClicked} /> : null}
      metadata={<MetadataView preprint={preprint} deposition={deposition} />}
    >
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
      {hasArticle && (
        <div ref={containerRef} style={{ width: '100%' }}>
          <Document
            file={`/api/pdf/?url=${encodeURIComponent(preprint.versions[0].public_download_url)}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {containerWidth > 0 &&
              Array.from(new Array(pdf?.numPages ?? 0), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) pageRefs.current[index] = el
                  }}
                >
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth}
                    loading={''}
                  />
                </div>
              ))}
          </Document>
        </div>
      )}
    </PaneledPage>
  )
}

export default PreprintViewer
