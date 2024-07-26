import React from 'react'
import { Box, Input, ThemeUIStyleObject, useThemeUI } from 'theme-ui'

interface TextInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
  placeholder?: string
  sx?: ThemeUIStyleObject
}

const TextInput: React.FC<TextInputProps> = ({
  title,
  onChange,
  placeholder,
  sx = {},
}) => {
  const { theme } = useThemeUI()
  return (
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
            border: '1px solid',
            borderColor: 'transparent',
            boxShadow: `1px 1px 0px 1px ${theme?.colors?.bezelGreyDark} inset, -1px -1px 0px 1px ${theme?.colors?.bezelGreyLight} inset`,
            borderRadius: 1,
            background: 'background',
            px: 3,
            width: '100%',
            outline: 'none',
            ':focus': {
              '::placeholder': { color: 'muted' },
              borderColor: 'blue',
            },
            ...sx,
          }}
        />
      </Box>
    </>
  )
}

export default TextInput
