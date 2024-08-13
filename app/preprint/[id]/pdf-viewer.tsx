'use client'

import { useState } from 'react'
import { Document, Outline, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

import { Box } from 'theme-ui'
import PaneledPage from '../../../components/layouts/paneled-page'
import StyledLink from '../../../components/link'
import { authorList } from '../../../utils/formatters'
import type { Preprint } from '../../../types/preprint'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PdfViewer = ({ preprint }: { preprint: Preprint }) => {
  const pdfProxyUrl = `/api/pdf/?url=${encodeURIComponent(preprint.versions[0].public_download_url)}`
  const [numPages, setNumPages] = useState(0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <PaneledPage sidebar={<></>} title={preprint.title}>
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
      <Document file={pdfProxyUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Outline />
        {numPages > 0 &&
          Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              loading={''}
            />
          ))}
      </Document>
    </PaneledPage>
  )
}

export default PdfViewer
