import { Suspense } from 'react'

import ResultsWrapper from './results-wrapper'
import PreprintsView from '../preprints-view'
import LoadingWrapper from '../loading-wrapper'
import { fetchWithAlerting } from '../../actions/server-utils'

interface SearchProps {
  searchParams: { [key: string]: string | undefined }
}

export const metadata = {
  title: 'Search – CDRXIV',
}

const preprintsPerPage = 48

const Search = async ({ searchParams }: SearchProps) => {
  const { query: search, view, ...rest } = searchParams // map query -> search and omit view from params passed to Janeway
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const offset = (page - 1) * preprintsPerPage

  const params = new URLSearchParams({
    search: search ?? '',
    ...rest,
    limit: preprintsPerPage.toString(),
    offset: offset.toString(),
  })

  const url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?${params.toString()}`

  const res = await fetchWithAlerting(url, { next: { revalidate: 180 } })
  const preprints = await res.json()
  const results = preprints.results || []

  return (
    <Suspense key={search} fallback={<LoadingWrapper />}>
      <ResultsWrapper count={preprints.count} search={search ?? ''}>
        <PreprintsView
          preprints={results}
          nextPage={preprints.next}
          totalCount={preprints.count}
          preprintsPerPage={preprintsPerPage}
        />
      </ResultsWrapper>
    </Suspense>
  )
}

export default Search
