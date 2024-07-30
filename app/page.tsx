import { getPreprints } from './api/utils'
import LandingPage from '../components/landing-page'
import { Preprints } from '../types/preprint'
import Topics from '../components/topics'

async function fetchPreprints(): Promise<Preprints> {
  try {
    const data = await getPreprints()
    return data.results
  } catch (err) {
    console.error(err)
    return []
  }
}

export default async function Page() {
  const preprints = await fetchPreprints()
  return (
    <>
      <Topics />
      <LandingPage preprints={preprints} />
    </>
  )
}
