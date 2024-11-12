import { Suspense } from 'react'
import LandingPage from './landing-page'
import PreprintsView from './preprints-view'
import StaticLandingPage from './static-landing-page'
import { isFullSiteEnabled } from '../utils/flags'
import LoadingWrapper from './loading-wrapper'
interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Preprints = async ({ subject }: { subject: string | undefined }) => {
  let url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?limit=12`
  if (subject) {
    url += `&subject=${subject}`
  }
  const res = await fetch(url, { next: { revalidate: 180 } })
  const preprints = await res.json()
  const results = preprints.results || []
  return (
    <PreprintsView preprints={results} nextPage={preprints.next as string} />
  )
}

const Home = async ({ searchParams }: HomeProps) => {
  const subject = searchParams.subject as string | undefined
  return isFullSiteEnabled() ? (
    <LandingPage>
      <Suspense fallback={<LoadingWrapper />}>
        <Preprints subject={subject} />
      </Suspense>
    </LandingPage>
  ) : (
    <StaticLandingPage />
  )
}

export default Home
