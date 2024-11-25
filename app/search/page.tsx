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

const Search = async ({ searchParams }: SearchProps) => {
  const { query: search, view, ...rest } = searchParams // map query -> search and omit view from params passed to Janeway
  const params = new URLSearchParams({ search: search ?? '', ...rest })
  const url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?${params.toString()}&limit=48`

  const res = await fetchWithAlerting(url, { next: { revalidate: 180 } })
  const preprints = await res.json()
  const results = preprints.results || []

  return (
    <Suspense key={search} fallback={<LoadingWrapper />}>
      <ResultsWrapper count={preprints.count} search={search ?? ''}>
        <PreprintsView
          preprints={results}
          nextPage={preprints.next as string}
        />
      </ResultsWrapper>
    </Suspense>
  )
}

export default Search
