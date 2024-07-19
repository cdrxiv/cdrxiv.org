'use client'

import { Box } from 'theme-ui'
import BasicPage from '../components/basic-page'
import Row from '../components/row'
import Column from '../components/column'

const Home = () => {
  return (
    <main>
      <BasicPage>
        <Row columns={[12]} gap={4} sx={{ mt: 4 }}>
          <Column start={1} width={3}>
            <Box sx={{ variant: 'text.heading' }}>
              Preprints and Data for Carbon Dioxide Removal
            </Box>
          </Column>
          <Column start={5} width={8}>
            <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Topics</Box>
            <Box sx={{ variant: 'text.body' }}>All</Box>
            <Box sx={{ variant: 'text.body' }}>
              Alkaline waste mineralization
            </Box>
            <Box sx={{ variant: 'text.body' }}>Direct air capture</Box>
          </Column>
        </Row>
      </BasicPage>
    </main>
  )
}

export default Home
