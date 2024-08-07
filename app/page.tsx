import { Suspense } from 'react'
import { getPreprints } from './api/utils'
import LandingPage from '../components/landing-page'
import PreprintsView from '../components/preprints-view'
interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Preprints = async ({ subject }: { subject: string | undefined }) => {
  const preprints = await getPreprints(subject)
  return <PreprintsView preprints={preprints.results} />
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
