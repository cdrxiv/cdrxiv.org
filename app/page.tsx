import { Suspense } from 'react'
import LandingPage from './landing-page'
import PreprintsView from './preprints-view'
import LoadingWrapper from './loading-wrapper'
import { fetchWithAlerting } from '../actions/server-utils'

interface HomeProps {
  searchParams: { [key: string]: string | undefined }
}

const preprintsPerPage = 48

const Home = async ({ searchParams }: HomeProps) => {
  const subject = searchParams.subject
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const offset = (page - 1) * preprintsPerPage
  let url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?limit=${preprintsPerPage}&offset=${offset}`
  if (subject) {
    url += `&subject=${subject}`
  }
  const res = await fetchWithAlerting(url, { next: { revalidate: 180 } })
  const preprints = await res.json()
  const results = preprints.results || []
  return (
    <LandingPage>
      <Suspense fallback={<LoadingWrapper />}>
        <PreprintsView
          preprints={results}
          nextPage={preprints.next}
          totalCount={preprints.count}
          preprintsPerPage={preprintsPerPage}
        />
      </Suspense>
    </LandingPage>
  )
}

export default Home
