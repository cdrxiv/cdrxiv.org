import { getPreprints, getSubjects } from './api/utils'
import Topics from '../components/topics'
import PreprintsView from '../components/preprints-view'
import type { Subjects } from '../types/subject'
import type { Preprints } from '../types/preprint'

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

  return (
    <>
      <Topics subjects={subjects} />
      <PreprintsView preprints={preprints} />
    </>
  )
}

export default Home
