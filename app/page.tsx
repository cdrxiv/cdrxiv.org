'use client'

import { Box } from 'theme-ui'
import BasicPage from '../components/basic-page'
import Row from '../components/row'
import Column from '../components/column'
import Badge from '../components/badge'
import Link from '../components/link'
import Button from '../components/button'
import Card from '../components/card'
import Dropdown from '../components/dropdown'
import TextInput from '../components/input'
import Filter from '../components/filter'

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
        <Row columns={[12]} gap={4} sx={{ mt: 3 }}>
          <Column start={1} width={12}>
            playground:
            <Box sx={{ fontSize: [1, 2, 3, 4], fontFamily: 'mono' }}>
              <Badge color='articlePink'>article</Badge>
              <Link showArrow={false} href=''>
                about
              </Link>
              <Box sx={{ variant: 'text.body' }}>cdr study </Box>
              <Button onClick={() => console.log('click')}>Submit</Button>
              <Card
                title='Enhanced weathering for unenhanced weather'
                authors={['tyler et al']}
                date={new Date()}
                type='article'
              ></Card>
              <Dropdown
                title='Filter by'
                selectedOption='All'
                options={['All', 'Articles', 'Data']}
                handleOptionChange={(e) => console.log(e.target.value)}
              />
              <TextInput
                placeholder='Search'
                title='Lookup'
                onChange={(e) => console.log(e.target.value)}
              />
              <Filter
                title='My Filter'
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
                selectedValue={'option2'}
                onChange={(e) => {
                  console.log(e)
                }}
                showAll={true}
                sx={{ mr: 4 }}
              />
            </Box>
          </Column>
        </Row>
      </BasicPage>
    </main>
  )
}

export default Home
