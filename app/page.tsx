import { getPreprints } from './api/utils'
import { Preprints } from '../types/preprint'
import Topics from '../components/topics'
import LandingPage from '../components/landing-page'

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
      <LandingPage preprints={preprints} />
    </>
  )
}

export default Home
