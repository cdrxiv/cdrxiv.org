import React from 'react'
import { Box, Button, Link, ThemeUIStyleObject, useThemeUI } from 'theme-ui'

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
  const { theme } = useThemeUI()
  const grey = theme?.colors?.mediumGray ?? 'grey'
  const black = theme?.colors?.black ?? 'black'

  const commonStyles: ThemeUIStyleObject = {
    variant: 'text.monoCaps',
    cursor: 'pointer',
    color: 'blue',
    background: 'white',
    borderRadius: 0,
    border: '1px solid',
    borderColor: 'backgroundGray',
    boxShadow: `1px 1px 0px 1px ${grey} inset, 
                -1px -1px 0px 1px ${black} inset`,
    outline: 'none',
    ':focus-visible': {
      borderColor: 'blue',
    },
    ':active': {
      boxShadow: `1px 1px 0px 1px ${black} inset, 
                  -1px -1px 0px 1px ${grey} inset`,
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
