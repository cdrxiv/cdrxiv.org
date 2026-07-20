'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'core-js/actual/promise/with-resolvers' // polyfill for react-pdf
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Box, Flex } from 'theme-ui'
import type { PDFDocumentProxy } from 'pdfjs-dist'

import PaneledPage from '../../../components/layouts/paneled-page'
import MetadataView from './preprint-metadata'
import Outline from './preprint-outline'
import DOIDisplay from './doi-display'
import { getAdditionalField } from '../../../utils/data'

import type { Preprint, SupplementaryFile } from '../../../types/preprint'
import Loading from '../../../components/loading'
import useTracking from '../../../hooks/use-tracking'
import { AuthorsList } from '../../../components'
import { Deposition } from '../../../types/zenodo'
import { fetchDataDeposition, fetchPreprintIdentifier } from '../../../actions'
import ErrorOrTrack from './error-or-track'
import { alertOnError } from '../../../actions/server-utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PAGE_RENDER_AHEAD_SCREENS = 4
const PAGE_RETAIN_SCREENS = 8

const LazyPdfPage = ({
  pdf,
  pageNumber,
  width,
  viewportHeight,
  fallbackAspectRatio,
  registerPage,
}: {
  pdf: PDFDocumentProxy
  pageNumber: number
  width: number
  viewportHeight: number
  fallbackAspectRatio: number
  registerPage: (pageIndex: number, element: HTMLDivElement | null) => void
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(pageNumber === 1)
  const [pageAspectRatio, setPageAspectRatio] = useState<number | null>(null)

  const pageHeight = Math.floor(
    width * (pageAspectRatio ?? fallbackAspectRatio),
  )

  const setContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      containerRef.current = element
      registerPage(pageNumber - 1, element)
    },
    [pageNumber, registerPage],
  )

  useEffect(() => {
    let cancelled = false
    setPageAspectRatio(null)

    pdf
      .getPage(pageNumber)
      .then((page) => {
        const viewport = page.getViewport({ scale: 1 })
        if (!cancelled) {
          setPageAspectRatio(viewport.height / viewport.width)
        }
      })
      .catch((error) => {
        if (!cancelled) console.error(error)
      })

    return () => {
      cancelled = true
    }
  }, [pageNumber, pdf])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const renderObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNearViewport(true)
      },
      {
        rootMargin: `${PAGE_RENDER_AHEAD_SCREENS * viewportHeight}px 0px`,
      },
    )
    const retentionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setIsNearViewport(false)
      },
      { rootMargin: `${PAGE_RETAIN_SCREENS * viewportHeight}px 0px` },
    )
    renderObserver.observe(element)
    retentionObserver.observe(element)

    return () => {
      renderObserver.disconnect()
      retentionObserver.disconnect()
    }
  }, [viewportHeight])

  return (
    <div ref={setContainerRef}>
      <Box
        sx={{
          height: ['1px', '1px', 5, 8],
          background: ['text', 'text', 'background', 'background'],
          px: [5, 0, 6, 8],
          mx: [-5, 0, -6, -8],
        }}
      />
      <div style={{ height: pageHeight }}>
        <Page
          pageNumber={pageNumber}
          width={width}
          loading={<Box sx={{ height: pageHeight }} />}
          renderMode={isNearViewport ? 'canvas' : 'none'}
          renderTextLayer={isNearViewport}
          renderAnnotationLayer={isNearViewport}
        />
      </div>
    </div>
  )
}

const PreprintViewer = ({
  preprint,
  preview,
}: {
  preprint: Preprint
  preview?: boolean
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [viewportHeight, setViewportHeight] = useState<number>(0)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(11 / 8.5)
  const [pdfOutline, setPdfOutline] = useState<Awaited<
    ReturnType<PDFDocumentProxy['getOutline']>
  > | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const track = useTracking()

  const hidePdfOutline =
    getAdditionalField(preprint, 'PDF outline') === 'Disabled'
  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const hasData = ['Data', 'Both'].includes(submissionType ?? '')
  const [deposition, setDeposition] = useState<Deposition>()
  const [preprintDoi, setPreprintDoi] = useState<string>()
  const dataUrl = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_PUBLISHED',
  )?.url
  const [isDepositionLoading, setIsDepositionLoading] = useState<boolean>(
    hasData && !!dataUrl,
  )
  const [isDoiLoading, setIsDoiLoading] = useState<boolean>(hasArticle)

  useEffect(() => {
    const fetchDoi = async () => {
      try {
        const identifiers = await fetchPreprintIdentifier(preprint.pk)
        if (identifiers.results) {
          setPreprintDoi(identifiers.results[0].identifier)
        }
        setIsDoiLoading(false)
      } catch {
        setIsDoiLoading(false)
      }
    }

    if (hasArticle) {
      fetchDoi()
    }
  }, [hasArticle, preprint.pk])

  useEffect(() => {
    const fetchDeposition = async () => {
      if (dataUrl) {
        try {
          const deposition = await fetchDataDeposition(dataUrl)
          setDeposition(deposition)
          setIsDepositionLoading(false)
        } catch {
          setIsDepositionLoading(false)
        }
      }
    }
    fetchDeposition()
  }, [dataUrl])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width)
      }
      setViewportHeight(window.innerHeight)
    }
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    window.addEventListener('resize', updateDimensions)
    updateDimensions()
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  useEffect(() => {
    track('preprint_view', {
      preprint: preprint.pk,
      submission_type: submissionType,
    })
  }, [track, preprint.pk, submissionType])

  useEffect(() => {
    if (pdf && !hidePdfOutline) {
      pdf.getOutline().then(setPdfOutline).catch(console.error)
    }
  }, [hidePdfOutline, pdf])

  const onItemClicked = useCallback(
    ({ pageNumber }: { pageNumber: number }) => {
      const pageRef = pageRefs.current[pageNumber - 1]
      if (pageRef) {
        pageRef.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [],
  )

  const registerPage = useCallback(
    (pageIndex: number, element: HTMLDivElement | null) => {
      pageRefs.current[pageIndex] = element
    },
    [],
  )

  const onPdfLoadSuccess = useCallback((loadedPdf: PDFDocumentProxy) => {
    setPdf(loadedPdf)
    loadedPdf
      .getPage(1)
      .then((page) => {
        const viewport = page.getViewport({ scale: 1 })
        setPageAspectRatio(viewport.height / viewport.width)
      })
      .catch(console.error)
  }, [])

  return (
    <PaneledPage
      title={preprint.title ?? ''}
      sidebar={
        pdf && pdfOutline ? (
          <Outline pdf={pdf} outline={pdfOutline} onItemClick={onItemClicked} />
        ) : null
      }
      metadata={
        <MetadataView
          preprint={preprint}
          deposition={deposition}
          isDepositionLoading={isDepositionLoading}
          preview={preview}
        />
      }
      leftCorner={
        getAdditionalField(preprint, 'Withdrawal status') === 'Approved' && (
          <Box sx={{ color: 'red', variant: 'text.monoCaps' }}>
            This submission has been withdrawn
          </Box>
        )
      }
    >
      <Flex sx={{ flexDirection: 'column' }}>
        {(isDoiLoading || preprintDoi) && (
          <DOIDisplay label='DOI' doi={preprintDoi} />
        )}
        <ErrorOrTrack
          hasError={hasArticle && !isDoiLoading && !preprintDoi}
          preview={preview}
          pk={preprint.pk}
          errorMessage={
            'No preprint identifier found. Ensure that Crossref DOI has been minted before publishing.'
          }
        />
        {preprint.doi && preprint.preprint_doi !== preprint.doi && (
          <DOIDisplay label='Published DOI' doi={preprint.doi} />
        )}
        {(isDepositionLoading || deposition) && (
          <DOIDisplay label='Dataset DOI' doi={deposition?.doi_url} />
        )}

        <ErrorOrTrack
          hasError={hasData && !isDepositionLoading && !deposition?.doi_url}
          preview={preview}
          pk={preprint.pk}
          errorMessage={'No dataset identifier found for data-only submission.'}
        />
      </Flex>
      <Box sx={{ variant: 'text.mono', mt: 3, mb: 7 }}>
        <AuthorsList authors={preprint.authors} orcidLinks />
      </Box>
      <Box sx={{ variant: 'text.monoCaps', fontSize: [3, 3, 3, 4], mb: 4 }}>
        Abstract
      </Box>
      <Box
        sx={{
          variant: 'text.body',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          mb: 9,
        }}
      >
        {preprint.abstract}
      </Box>
      {hasArticle && preprint.versions.length > 0 && (
        <div ref={containerRef} style={{ width: '100%' }}>
          <Document
            file={preprint.versions[0].public_download_url}
            onLoadSuccess={onPdfLoadSuccess}
            onLoadError={(error) =>
              window.location.hostname.includes('cdrxiv.org') && !preview
                ? alertOnError({
                    endpoint: preprint.versions[0].public_download_url,
                    status: 'n/a',
                    statusText: 'unknown',
                    method: 'GET',
                    apiError: error.message,
                  })
                : undefined
            }
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
            {pdf &&
              containerWidth > 0 &&
              viewportHeight > 0 &&
              Array.from(new Array(pdf.numPages), (_, index) => (
                <LazyPdfPage
                  key={`page_${index + 1}`}
                  pdf={pdf}
                  pageNumber={index + 1}
                  width={containerWidth}
                  viewportHeight={viewportHeight}
                  fallbackAspectRatio={pageAspectRatio}
                  registerPage={registerPage}
                />
              ))}
          </Document>
        </div>
      )}
    </PaneledPage>
  )
}

export default PreprintViewer
