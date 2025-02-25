import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Link } from '../components'

type PaginationProps = {
  totalCount: number | undefined
  itemsPerPage: number | undefined
  currentPage: number
  hasNextPage: boolean
}

const generatePaginationLinks = (
  totalCount: number | undefined,
  itemsPerPage: number | undefined,
  currentPage: number,
) => {
  if (!totalCount || !itemsPerPage) return []
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  let pages = []

  if (totalPages < 8) {
    pages = Array(totalPages)
      .fill(null)
      .map((d, i) => i + 1)
  } else if (currentPage <= 4) {
    pages = [1, 2, 3, 4, 5, 6, '...', totalPages]
  } else if (totalPages - currentPage <= 4) {
    pages = [
      1,
      '...',
      ...Array(6)
        .fill(null)
        .map((d, i) => totalPages - 5 + i),
    ]
  } else {
    pages = [
      1,
      '...',
      ...Array(5)
        .fill(null)
        .map((d, i) => currentPage - 2 + i),
      '...',
      totalPages,
    ]
  }
  return pages
}

const Pagination = ({
  totalCount,
  itemsPerPage,
  currentPage,
  hasNextPage,
}: PaginationProps) => {
  const paginationLinks = generatePaginationLinks(
    totalCount,
    itemsPerPage,
    currentPage,
  )
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) =>
    `?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() })}`

  if (paginationLinks.length === 0 && !hasNextPage && currentPage <= 1) {
    return null
  }

  return (
    <Flex sx={{ justifyContent: 'center', gap: 2, mt: 5 }}>
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
      )}
      {paginationLinks.map((page, i) =>
        page === '...' || page === currentPage ? (
          <Box as='span' sx={{ mt: '1px' }} key={i}>
            {page}
          </Box>
        ) : (
          <Link key={i} href={createPageUrl(page as number)}>
            {page}
          </Link>
        ),
      )}
      {hasNextPage && <Link href={createPageUrl(currentPage + 1)}>Next</Link>}
    </Flex>
  )
}

export default Pagination
