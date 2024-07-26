'use client'

import { Box } from 'theme-ui'
import BasicPage from '../components/basic-page'
import Row from '../components/row'
import Column from '../components/column'
import Badge from '../components/badge'
import Link from '../components/link'
import Button from '../components/button'
import Card from '../components/card'
import Select from '../components/select'
import TextInput from '../components/input'
import Filter from '../components/filter'
import PreprintsView from '../components/preprints-view'

const Home = () => {
  return (
    <>
      <Row sx={{ mt: 4 }}>
        <Column start={1} width={3}>
          <Box sx={{ variant: 'text.heading' }}>
            Preprints and Data for Carbon Dioxide Removal
          </Box>
        </Column>
        <Column start={5} width={8}>
          <Box sx={{ variant: 'text.monoCaps', mb: 3 }}>Topics</Box>
          <Box sx={{ variant: 'text.body' }}>All</Box>
          <Box sx={{ variant: 'text.body' }}>Alkaline waste mineralization</Box>
          <Box sx={{ variant: 'text.body' }}>Direct air capture</Box>
        </Column>
      </Row>
      <Row sx={{ mt: 3 }}>
        <Column start={1} width={[6, 8, 12, 12]}>
          <Box sx={{ my: 8 }}>
            <PreprintsView />
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

        <Column start={1} width={3}>
          <Card
            title='Enhanced weathering for unenhanced weather'
            authors={['tyler et al']}
            date={new Date()}
            type='article'
          />
        </Column>
        <Column start={[1, 5]} width={3}>
          <Card
            title='Enhanced weathering for unenhanced weather href'
            authors={['tyler et al']}
            date={new Date()}
            type='article'
            href='/submit'
          />
        </Column>
        <Column start={[1, 9]} width={3}>
          <Card
            title='Enhanced weathering for unenhanced weather onclick'
            authors={['tyler et al']}
            date={new Date()}
            type='article'
            onClick={() => console.log('click')}
          />
        </Column>
      </Row>
      <Row sx={{ mt: 10 }}>
        <Column start={1} width={[6, 8, 12, 12]}>
          <Box sx={{ fontSize: [1, 2, 3, 4], fontFamily: 'mono' }}>
            <Badge color='articlePink'>article</Badge>
            <Link showArrow={false} href=''>
              about
            </Link>
            <Button onClick={() => console.log('click')}>Submit</Button>
            <Select
              title='Filter by'
              value='Data'
              onChange={(e) => console.log(e.target.value)}
            >
              <option value='All'>All</option>
              <option value='Articles'>Articles</option>
              <option value='Data'>Data</option>
            </Select>
            <TextInput
              placeholder='Search'
              title='Lookup'
              onChange={(e) => console.log(e.target.value)}
            />
          </Box>
        </Column>
      </Row>
    </>
  )
}

export default Home
