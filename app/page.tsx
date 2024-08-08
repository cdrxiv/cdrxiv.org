import { Suspense } from 'react'
import LandingPage from './landing-page'
import PreprintsView from './preprints-view'
interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Preprints = async ({ subject }: { subject: string | undefined }) => {
  let url =
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/published_preprints/'
  if (subject) {
    const queryString = `subject=${subject}`
    url = `${url}?${queryString}`
  }
  const res = await fetch(url, { next: { revalidate: 3600 } })
  const preprints = await res.json()
  const results = preprints.results || []
  return <PreprintsView preprints={results} />
}

const Home = async ({ searchParams }: HomeProps) => {
  const subject = searchParams.subject as string | undefined
  return (
    <LandingPage>
      <Suspense key={subject} fallback={<div>Loading...</div>}>
        <Preprints subject={subject} />
      </Suspense>
    </LandingPage>
  )
}

export default Home
