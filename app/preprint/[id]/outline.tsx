import React, { useState, useEffect } from 'react'
import { NavLink } from '../../../components'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { Box } from 'theme-ui'

type PDFOutline = Awaited<ReturnType<PDFDocumentProxy['getOutline']>>
type OutlineItem = PDFOutline[number]

interface OutlineProps {
  pdf: PDFDocumentProxy
  onItemClick: (item: any) => void
}

const Outline = ({ pdf, onItemClick }: OutlineProps) => {
  const [outline, setOutline] = useState<PDFOutline | null>(null)

  useEffect(() => {
    if (pdf) {
      pdf.getOutline().then(setOutline).catch(console.error)
    }
  }, [pdf])

  if (!outline) {
    return null
  }

  const handleItemClick = async (item: OutlineItem) => {
    if (item.dest && Array.isArray(item.dest)) {
      const destRef = item.dest[0]
      if (destRef) {
        const pageIndex = await pdf.getPageIndex(destRef)
        const pageNumber = pageIndex + 1
        onItemClick({ pageNumber, title: item.title })
      }
    }
  }

  const renderOutlineItems = (items: PDFOutline, level = 0) => {
    return (
      <Box>
        <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 3 }}>Overview</Box>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <NavLink
              active={false}
              onClick={() => handleItemClick(item)}
              sx={{
                display: 'block',
                marginBottom: '8px',
                marginLeft: `${level * 20}px`,
                cursor: 'pointer',
              }}
            >
              {item.title}
            </NavLink>
            {item.items &&
              item.items.length > 0 &&
              renderOutlineItems(item.items, level + 1)}
          </React.Fragment>
        ))}
      </Box>
    )
  }

  return <>{renderOutlineItems(outline)}</>
}

export default Outline
