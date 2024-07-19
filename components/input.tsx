import React from 'react'
import { Box, Input } from 'theme-ui'

interface TextInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
  placeholder?: string
  backgroundColor?: string
  arrows?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  title,
  onChange,
  placeholder,
  backgroundColor,
  arrows,
}) => (
  <Box sx={{ mx: 2 }}>
    {title && (
      <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2], my: 2 }}>
        {title}
      </Box>
    )}
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Input
        placeholder={placeholder ?? ''}
        onChange={onChange}
        sx={{
          variant: 'text.body',
          border: '2px solid',
          borderColor: 'mediumGray',
          borderRadius: 0,
          background: backgroundColor ?? 'backgroundGray',
          pl: 3,
          pr: arrows ? 5 : 3,
          width: '100%',
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
  </Box>
)

export default TextInput
