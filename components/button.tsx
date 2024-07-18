import React from 'react'
import { Button, ThemeUIStyleObject, useThemeUI } from 'theme-ui'

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

  const commonProps = {
    sx: {
      variant: 'text.monoCaps',
      cursor: 'pointer',
      color: 'blue',
      background: 'white',
      borderRadius: '0',
      boxShadow: `1px 1px 0px 1px ${grey} inset, 
                -1px -1px 0px 1px ${black} inset`,
      pb: [9, 9, 9, 11],
      ...sx,
    },
    ...(href ? { as: 'a', href } : { onClick }),
  }

  return <Button {...commonProps}>{children}</Button>
}

export default StyledButton
