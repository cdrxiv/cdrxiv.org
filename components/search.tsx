import React from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'
import Input from './input'

interface SearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  arrows?: boolean
  sx?: ThemeUIStyleObject
}

const Search: React.FC<SearchProps> = ({
  onChange,
  placeholder,
  arrows = true,
  sx = {},
}) => {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Input
        placeholder={placeholder ?? ''}
        onChange={onChange}
        sx={{
          variant: 'text.monoCaps',
          boxShadow: (theme) => `1px 1px 1px 1px ${theme?.colors?.text} inset, 
                -1px -1px 1px 1px ${theme?.colors?.muted} inset`,
          background: 'primary',
          pr: arrows ? 5 : 3,
          '::placeholder': { color: 'text' },
          ...sx,
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
