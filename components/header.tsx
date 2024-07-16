import { Box } from 'theme-ui'

interface HeaderProps {
  numberArticles: number
}

const Header = ({ numberArticles }: HeaderProps) => {
  return (
    <header>
      <h1>CDRXIV</h1>
      <Box sx={{ fontSize: [1, 2, 3, 4] }}>{numberArticles} articles</Box>
    </header>
  )
}

export default Header
