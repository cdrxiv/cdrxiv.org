import { Box } from 'theme-ui'
import Badge from './badge'
import Link from './link'

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
      </Box>
    </header>
  )
}

export default Header
