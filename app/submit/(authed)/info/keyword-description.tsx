import { Box } from 'theme-ui'
import { getSuggestedKeywords } from './utils'

const KeywordDescription: React.FC<{
  keywords: string[]
  subject: string[]
  setKeywords: (value: string[]) => void
}> = ({ keywords, subject, setKeywords }) => {
  const suggestions = getSuggestedKeywords(subject, keywords)
  return (
    <Box>
      <Box as='span' sx={{ mr: 2, lineHeight: '145%' }}>
        Type and enter to add a new keyword. Click on a keyword to remove it.
        {suggestions.length > 0
          ? ' Or, select a suggested keyword for your submission:'
          : ''}
      </Box>
      {suggestions.map((v, i) => (
        <Box
          as='button'
          key={v}
          onClick={() => setKeywords([...keywords, v])}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setKeywords([...keywords, v])
            }
          }}
          sx={{
            variant: 'styles.a',
            fontFamily: 'mono',
            fontWeight: 'mono',
            fontSize: [0, 0, 0, 1],
            lineHeight: '130%',
            color: 'listBorderGrey',
            mr: i === suggestions.length - 1 ? 0 : 2,
          }}
        >
          {v}
        </Box>
      ))}
    </Box>
  )
}

export default KeywordDescription
