import { Suspense } from 'react'

import ResultsWrapper from './results-wrapper'
import PreprintsView from '../preprints-view'

interface SearchProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Search = async ({ searchParams }: SearchProps) => {
  const search = searchParams.query as string | undefined
  const url = `https://carbonplan.endurance.janeway.systems/carbonplan/api/published_preprints/?search=${search}`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const preprints = await res.json()
  const results = preprints.results || []

  return (
    <Suspense key={search} fallback={<div>Loading...</div>}>
      <ResultsWrapper count={results.length} search={search ?? ''}>
        <PreprintsView preprints={results} />
      </ResultsWrapper>
    </Suspense>
  )
}

export default Search
