import LandingPage from './landing-page'
import PreprintsView from './preprints-view'
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

  let results = []
  let nextPage = null
  let totalCount = 0
  let error = false

  try {
    const res = await fetchWithAlerting(url, { next: { revalidate: 180 } })
    const preprints = await res.json()
    results = preprints.results || []
    nextPage = preprints.next
    totalCount = preprints.count
  } catch (err) {
    error = true
  }

  return (
    <LandingPage>
      {error ? (
        <div style={{ textAlign: 'center' }}>Unable to load preprints.</div>
      ) : (
        <PreprintsView
          preprints={results}
          nextPage={nextPage}
          totalCount={totalCount}
          preprintsPerPage={preprintsPerPage}
        />
      )}
    </LandingPage>
  )
}

export default Home
