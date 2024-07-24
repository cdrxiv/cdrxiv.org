'use client'

import { Suspense } from 'react'
import PreprintsView from '../components/preprints-view'

const Home = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <PreprintsView />
      </Suspense>
    </main>
  )
}

export default Home
