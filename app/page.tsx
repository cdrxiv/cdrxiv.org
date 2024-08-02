import { getPreprints, getSubjects } from './api/utils'
import type { Subjects } from '../types/subject'
import type { Preprints } from '../types/preprint'
import LandingPage from '../components/landing-page'

export const dynamic = 'force-dynamic'

async function fetchData(): Promise<[Preprints, Subjects]> {
  try {
    const [preprintsData, subjectsData] = await Promise.all([
      getPreprints(),
      getSubjects(),
    ])
    return [preprintsData.results, subjectsData.results]
  } catch (err) {
    console.error(err)
    return [[], []]
  }
}

const Home = async () => {
  const [preprints, subjects] = await fetchData()

  return <LandingPage preprints={preprints} subjects={subjects} />
}

export default Home
