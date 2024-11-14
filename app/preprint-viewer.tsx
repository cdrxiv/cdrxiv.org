'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Box, Flex } from 'theme-ui'
import type { PDFDocumentProxy } from 'pdfjs-dist'

import PaneledPage from '../components/layouts/paneled-page'
import StyledLink from '../components/link'
import MetadataView from './preprint-metadata'
import Outline from './preprint-outline'
import { getAdditionalField } from '../utils/data'

import type { Preprint } from '../types/preprint'
import Loading from '../components/loading'
import useTracking from '../hooks/use-tracking'
import { AuthorsList } from '../components'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PreprintViewer = ({
  preprint,
  preview,
}: {
  preprint: Preprint
  preview?: boolean
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [pdfOutline, setPdfOutline] = useState<Awaited<
    ReturnType<PDFDocumentProxy['getOutline']>
  > | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const track = useTracking()

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

  useEffect(() => {
    track('preprint_view', {
      preprint: preprint.pk,
      submission_type: submissionType,
    })
  }, [track, preprint.pk, submissionType])

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy): void => {
    setPdf(pdf)
  }

  useEffect(() => {
    if (pdf) {
      pdf.getOutline().then(setPdfOutline).catch(console.error)
    }
  }, [pdf])

  const onItemClicked = useCallback(
    ({ pageNumber }: { pageNumber: number }) => {
      const pageRef = pageRefs.current[pageNumber - 1]
      if (pageRef) {
        pageRef.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [],
  )

  return (
    <PaneledPage
      title={preprint.title ?? ''}
      sidebar={
        pdf && pdfOutline ? (
          <Outline pdf={pdf} outline={pdfOutline} onItemClick={onItemClicked} />
        ) : null
      }
      metadata={<MetadataView preprint={preprint} preview={preview} />}
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
      <Box sx={{ variant: 'text.mono', mt: 3, mb: 7 }}>
        <AuthorsList authors={preprint.authors} orcidLinks />
      </Box>
      <Box sx={{ variant: 'text.monoCaps', fontSize: [3, 3, 3, 4], mb: 4 }}>
        Abstract
      </Box>
      <Box sx={{ variant: 'text.body', mb: 9 }}>{preprint.abstract}</Box>
      {hasArticle && preprint.versions.length > 0 && (
        <div ref={containerRef} style={{ width: '100%' }}>
          <Document
            file={`https://cdrxiv-file-uploader.fly.dev/janeway/pdf?url=${encodeURIComponent(preprint.versions[0].public_download_url)}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Flex
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Loading />
              </Flex>
            }
          >
            {containerWidth > 0 &&
              Array.from(new Array(pdf?.numPages ?? 0), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) pageRefs.current[index] = el
                  }}
                >
                  <Box
                    sx={{
                      height: ['1px', '1px', 5, 8],
                      background: ['text', 'text', 'background', 'background'],
                      px: [5, 0, 6, 8],
                      mx: [-5, 0, -6, -8],
                    }}
                  />
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
