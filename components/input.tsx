import React from 'react'
import { Box, Input } from 'theme-ui'

interface TextInputProps {
  title: string
  placeholder: string
  value: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.FC<TextInputProps> = ({
  title,
  value,
  handleChange,
  placeholder,
}) => {
  return (
    <Box sx={{ mx: 2 }}>
      <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2], my: 2 }}>
        {title}
      </Box>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        sx={{
          variant: 'text.body',
          border: '2px solid',
          borderColor: 'mediumGray',
          borderRadius: 0,
          background: 'backgroundGray',
          px: 3,
        }}
      />
    </Box>
  )
}

export default TextInput
