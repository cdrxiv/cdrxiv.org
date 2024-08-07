import { getPreprints } from './api/utils'
import LandingPage from '../components/landing-page'
interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const Home = async ({ searchParams }: HomeProps) => {
  const subject = searchParams.subject as string | undefined
  const preprints = await getPreprints(subject)
  return <LandingPage preprints={preprints.results} />
}

export default Home
