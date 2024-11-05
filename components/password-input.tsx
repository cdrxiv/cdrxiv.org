import React, { forwardRef, useState } from 'react'
import { Box, Input, InputProps } from 'theme-ui'
import { Link } from '.'

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type, sx, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Input
          ref={ref}
          type={isPasswordVisible ? 'text' : 'password'}
          sx={{ ...sx, pr: 10 }}
          {...props}
        />
        <Link
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          sx={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            variant: 'text.monoCaps',
            textDecoration: 'none',
          }}
        >
          {isPasswordVisible ? '(hide)' : '(show)'}
        </Link>
      </Box>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
