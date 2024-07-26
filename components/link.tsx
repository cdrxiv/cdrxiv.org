import React from 'react'
import { Link, Button, ThemeUIStyleObject } from 'theme-ui'

type LinkProps = {
  href?: string
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void
  children: React.ReactNode
  showArrow?: boolean
  sx?: ThemeUIStyleObject
}

const StyledLink: React.FC<LinkProps> = ({
  href,
  onClick,
  children,
  showArrow = false,
  sx = {},
}) => {
  const commonStyles: ThemeUIStyleObject = {
    color: 'blue',
    ':visited': { color: 'purple' },
    cursor: 'pointer',
    background: 'none',
    border: '1px solid',
    borderColor: 'transparent',
    outline: 'none',
    ':focus-visible': {
      borderColor: 'blue',
    },
    padding: 0,
    textDecoration: 'underline',
    variant: 'text.body',
    ...sx,
  }

  if (href !== undefined) {
    return (
      <Link href={href} sx={commonStyles}>
        {children}
        {showArrow && ' >>'}
      </Link>
    )
  }

  return (
    <Button onClick={onClick} sx={commonStyles}>
      {children}
      {showArrow && ' >>'}
    </Button>
  )
}

export default StyledLink
