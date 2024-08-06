import { getPreprints, getSubjects } from './api/utils'
import type { Subjects } from '../types/subject'
import type { Preprints } from '../types/preprint'
import LandingPage from '../components/landing-page'

async function fetchData(searchParams: {
  [key: string]: string | string[] | undefined
}): Promise<[Preprints, Subjects]> {
  try {
    const subject = searchParams.subject as string | undefined
    const [preprintsData, subjectsData] = await Promise.all([
      getPreprints(subject),
      getSubjects(),
    ])
    return [preprintsData.results, subjectsData.results]
  } catch (err) {
    console.error(err)
    return [[], []]
  }
}

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Home = async ({ searchParams }: HomeProps) => {
  const [preprints, subjects] = await fetchData(searchParams)
  return <LandingPage preprints={preprints} subjects={subjects} />
}

export default Home
