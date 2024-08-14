import { Suspense } from 'react'

import ResultsWrapper from './results-wrapper'
import PreprintsView from '../preprints-view'

interface SearchProps {
  searchParams: { [key: string]: string | undefined }
}

const Search = async ({ searchParams }: SearchProps) => {
  const { query: search, view, ...rest } = searchParams // map query -> search and omit view from params passed to Janeway
  const params = new URLSearchParams({ search: search ?? '', ...rest })
  const url = `https://carbonplan.endurance.janeway.systems/carbonplan/api/published_preprints/?${params.toString()}`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const preprints = await res.json()
  const results = preprints.results || []

  return (
    <Suspense key={search} fallback={<div>Loading...</div>}>
      <ResultsWrapper
        count={results.length}
        search={search ?? ''}
        next={preprints.next}
        previous={preprints.previous}
      >
        <PreprintsView preprints={results} />
      </ResultsWrapper>
    </Suspense>
  )
}

export default Search
