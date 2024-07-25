import React from 'react'
import { Box, Button, Link, ThemeUIStyleObject } from 'theme-ui'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  sx?: ThemeUIStyleObject
}

const StyledButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  href,
  sx = {},
}) => {
  const commonStyles: ThemeUIStyleObject = {
    variant: 'text.monoCaps',
    cursor: 'pointer',
    color: 'blue',
    background: 'primary',
    borderRadius: 0,
    border: '1px solid',
    borderColor: 'background',
    boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.muted} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.text} inset`,
    outline: 'none',
    ':focus-visible': {
      borderColor: 'blue',
    },
    ':active': {
      boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.text} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.muted} inset`,
    },
    pb: [9, 9, 9, 11],
    ...sx,
  }

  const buttonContent = (
    <Button onClick={href ? undefined : onClick} sx={commonStyles}>
      <Box sx={{ ':active': { transform: 'translate(1px, 1px)' } }}>
        {children}
      </Box>
    </Button>
  )

  return href ? (
    <Link
      href={href}
      sx={{
        textDecoration: 'none',
      }}
    >
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  )
}

export default StyledButton
