'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Box, Flex } from 'theme-ui'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

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

  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set())
  const [pageHeight, setPageHeight] = useState<number>(600)

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
  const [isDoiLoading, setIsDoiLoading] = useState<boolean>(true)

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

    fetchDoi()
  }, [preprint.pk])

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

  useEffect(() => {
    if (!pdf || pageRefs.current.length === 0) return

    const buffer = 2
    const intersectingPages = new Set<number>()

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const pageIndex = Number(
          (entry.target as HTMLElement).dataset.pageIndex,
        )
        const pageNumber = pageIndex + 1
        if (entry.isIntersecting) {
          intersectingPages.add(pageNumber)
        }
      }

      const minPage = Math.min(...Array.from(intersectingPages))
      const maxPage = Math.max(...Array.from(intersectingPages))

      const startPage = Math.max(minPage - buffer, 1)
      const endPage = Math.min(maxPage + buffer, pdf.numPages)

      const newVisiblePages = new Set<number>()
      for (let p = startPage; p <= endPage; p++) {
        newVisiblePages.add(p)
      }

      if (Array.from(newVisiblePages).some((p) => !visiblePages.has(p))) {
        console.log('newVisiblePages', newVisiblePages)
        setVisiblePages(newVisiblePages)
      }
    })

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [pdf, visiblePages, pageRefs, setVisiblePages])

  const setHeightFromFirstPage = useCallback(
    (page: PDFPageProxy) => {
      const scale = containerWidth / page.view[2]
      const viewport = page.getViewport({ scale })
      setPageHeight(viewport.height)
    },
    [containerWidth],
  )

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
          hasError={!isDoiLoading && !preprintDoi}
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
      </Flex>
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
            file={preprint.versions[0].public_download_url}
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
              Array.from(new Array(pdf?.numPages ?? 0), (_, index) => {
                const pageNumber = index + 1
                return (
                  <div
                    key={`page_container_${pageNumber}`}
                    data-page-index={index}
                    ref={(el: HTMLDivElement | null) => {
                      if (el) pageRefs.current[index] = el
                    }}
                  >
                    <Box
                      sx={{
                        height: ['1px', '1px', 5, 8],
                        background: [
                          'text',
                          'text',
                          'background',
                          'background',
                        ],
                        px: [5, 0, 6, 8],
                        mx: [-5, 0, -6, -8],
                      }}
                    />
                    {visiblePages.has(pageNumber) ? (
                      <Page
                        key={`page_${pageNumber}`}
                        pageNumber={pageNumber}
                        width={containerWidth}
                        loading={
                          <Flex
                            sx={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: `${pageHeight}px`,
                            }}
                          >
                            <Loading />
                          </Flex>
                        }
                        onRenderSuccess={
                          pageNumber === 1 ? setHeightFromFirstPage : undefined
                        }
                      />
                    ) : (
                      <Box sx={{ height: `${pageHeight}px` }} />
                    )}
                  </div>
                )
              })}
          </Document>
        </div>
      )}
    </PaneledPage>
  )
}

export default PreprintViewer
