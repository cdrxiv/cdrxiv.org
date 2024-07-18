import { Box } from 'theme-ui'
import Badge from './badge'
import Link from './link'
import Button from './button'
import Card from './card'
import Dropdown from './dropdown'
import TextInput from './input'

interface HeaderProps {
  numberArticles: number
}

const Header = ({ numberArticles }: HeaderProps) => {
  return (
    <header>
      <Box sx={{ variant: 'text.heading' }}>CDRXIV</Box>
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
          handleChange={(e) => console.log(e.target.value)}
        />
      </Box>
    </header>
  )
}

export default Header
