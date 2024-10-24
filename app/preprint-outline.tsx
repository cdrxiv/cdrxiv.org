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

const levelStyles = {
  0: {},
  1: {
    ml: '20px',
    fontSize: [1, 1, 1, 2],
    '&:hover::before': {
      content: '">"',
      position: 'absolute',
      left: 0,
      ml: '20px',
    } as any,
  },
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
        (accum: OutlinePath[], item, index) => [
          ...accum,
          {
            key: `${item.title}-${index}`,
            title: item.title,
            href: item.url ?? '',
            public: true,
            onClick: () => handleItemClick(item),
            sx: levelStyles[level as 0 | 1],
          },
          ...(level < 1 ? getOutlineItems(item.items, level + 1) : []),
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
