import React from 'react'
import { Box, Input, useThemeUI } from 'theme-ui'

interface SearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  arrows?: boolean
}

const Search: React.FC<SearchProps> = ({
  onChange,
  placeholder,
  arrows = true,
}) => {
  const { theme } = useThemeUI()
  const grey = theme?.colors?.mediumGray ?? 'grey'
  const black = theme?.colors?.black ?? 'black'
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Input
        placeholder={placeholder ?? ''}
        onChange={onChange}
        sx={{
          variant: 'text.monoCaps',
          border: '1px solid',
          borderColor: 'backgroundGray',
          borderRadius: 1,
          boxShadow: `1px 1px 1px 1px ${black} inset, 
                -1px -1px 1px 1px ${grey} inset`,
          background: 'white',
          pl: 3,
          pr: arrows ? 5 : 3,
          width: '100%',
          outline: 'none',
          '::placeholder': { color: 'black' },
          ':focus': {
            '::placeholder': { color: 'mediumGray' },
            borderColor: 'blue',
          },
        }}
      />
      {arrows && (
        <Box
          sx={{
            position: 'absolute',
            right: 3,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'blue',
            letterSpacing: '0.1em',
          }}
        >
          &gt;&gt;
        </Box>
      )}
    </Box>
  )
}

export default Search
