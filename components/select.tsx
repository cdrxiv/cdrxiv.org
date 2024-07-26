import React from 'react'
import { Box, Select as ThemeUISelect, SelectProps } from 'theme-ui'

const Select: React.FC<SelectProps> = (props) => {
  return (
    <ThemeUISelect
      {...props}
      arrow={
        <Box
          sx={{
            variant: 'text.body',
            color: 'blue',
            ml: -28,
            alignSelf: 'center',
            pointerEvents: 'none',
          }}
        >
          {'>'}
        </Box>
      }
    />
  )
}

export default Select
