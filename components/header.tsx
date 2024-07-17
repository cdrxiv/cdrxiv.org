import { Box } from 'theme-ui'

interface HeaderProps {
  numberArticles: number
}

const Header = ({ numberArticles }: HeaderProps) => {
  return (
    <header>
      <Box sx={{ fontSize: [5], fontFamily: 'heading' }}>CDRXIV</Box>
      <Box sx={{ fontSize: [1, 2, 3, 4], fontFamily: 'mono' }}>
        {numberArticles} articles
      </Box>
    </header>
  )
}

export default Header
