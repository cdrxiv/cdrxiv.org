import React from 'react'
import { Box, Input } from 'theme-ui'

interface TextInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
  placeholder?: string
  backgroundColor?: string
}

const TextInput: React.FC<TextInputProps> = ({
  title,
  onChange,
  placeholder,
  backgroundColor,
}) => (
  <>
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
          px: 3,
          width: '100%',
        }}
      />
    </Box>
  </>
)

export default TextInput
