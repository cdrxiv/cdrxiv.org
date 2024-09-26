import React, { useCallback, useMemo } from 'react'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { ThemeUIStyleObject } from 'theme-ui'
import { NavSidebar } from '../components'

type PDFOutline = Awaited<ReturnType<PDFDocumentProxy['getOutline']>>
type OutlineItem = PDFOutline[number]

interface OutlineProps {
  pdf: PDFDocumentProxy
  outline: PDFOutline
  onItemClick: (item: any) => void
}

type OutlinePath = {
  title: string
  href: string
  public: boolean
  onClick: () => void
  sx?: ThemeUIStyleObject
}

const PreprintOutline = ({ pdf, outline, onItemClick }: OutlineProps) => {
  const handleItemClick = useCallback(
    async (item: OutlineItem) => {
      if (item.dest && Array.isArray(item.dest)) {
        const destRef = item.dest[0]
        if (destRef) {
          const pageIndex = await pdf.getPageIndex(destRef)
          const pageNumber = pageIndex + 1
          onItemClick({ pageNumber, title: item.title })
        }
      }
    },
    [onItemClick, pdf],
  )

  const outlinePaths = useMemo(() => {
    if (!outline) {
      return null
    }

    const getOutlineItems = (items: PDFOutline, level = 0): OutlinePath[] => {
      return items.reduce(
        (accum: OutlinePath[], item) => [
          ...accum,
          {
            title: item.title,
            href: item.url ?? item.title,
            public: true,
            onClick: () => handleItemClick(item),
            sx: level > 0 ? { ml: `${level * 20}px` } : {},
          },
          ...getOutlineItems(item.items, level + 1),
        ],
        [],
      )
    }

    return getOutlineItems(outline)
  }, [outline, handleItemClick])

  if (!outlinePaths) {
    return null
  }

  return <NavSidebar paths={outlinePaths} />
}

export default PreprintOutline
