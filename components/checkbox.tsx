import React from 'react'
import { Box, CheckboxProps, ThemeUIStyleObject } from 'theme-ui'

const CheckboxDisplay = ({ sx }: { sx?: ThemeUIStyleObject }) => {
  return (
    <Box
      aria-hidden='true'
      sx={{
        variant: 'text.monoCaps',
        mr: 2,
        color: 'blue',
        border: '1px solid',
        borderColor: 'transparent',
        outline: 'none',
        'input:focus-visible ~ &': {
          borderColor: 'blue',
        },
        '& .x': {
          display: 'none',
        },
        '& .space': {
          display: 'initial',
        },
        'input:checked ~ &': {
          '.x': {
            display: 'initial',
          },
          '.space': {
            display: 'none',
          },
        },
        'input:enabled ~ &': {
          cursor: 'pointer',
        },
        'input:hover:enabled ~ &': {
          textDecoration: 'underline',
        },
        ...sx,
      }}
    >
      (
      <Box as='span' className='x'>
        x
      </Box>
      <Box as='span' className='space'>
        &nbsp;
      </Box>
      )
    </Box>
  )
}

const Checkbox: React.FC<CheckboxProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={{ minWidth: 'min-content' }}>
      <Box
        as='input'
        type='checkbox'
        {...props}
        sx={{
          position: 'absolute',
          opacity: 0,
          zIndex: -1,
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      />
      <CheckboxDisplay sx={sx} />
      {children}
    </Box>
  )
}

export default Checkbox
