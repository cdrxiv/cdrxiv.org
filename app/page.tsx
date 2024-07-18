import Header from '../components/header'
import BasicPage from '../components/basic-page'

const Home = () => {
  return (
    <main>
      <BasicPage>
        <Header numberArticles={10} />
      </BasicPage>
    </main>
  )
}

export default Home
