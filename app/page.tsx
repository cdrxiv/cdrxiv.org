import { getPreprints } from './api/utils'
import type { Preprints } from '../types/preprint'
import Topics from '../components/topics'
import PreprintsView from '../components/preprints-view'

export const dynamic = 'force-dynamic'

async function fetchPreprints(): Promise<Preprints> {
  try {
    const data = await getPreprints()
    return data.results
  } catch (err) {
    console.error(err)
    return []
  }
}
const Home = async () => {
  const preprints = await fetchPreprints()

  return (
    <>
      <Topics />
      <PreprintsView preprints={preprints} />
    </>
  )
}

export default Home
