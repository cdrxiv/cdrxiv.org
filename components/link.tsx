import React from 'react'
import { Link, Button, ThemeUIStyleObject } from 'theme-ui'

type LinkProps = {
  href?: string
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void
  children: React.ReactNode
  showArrow?: boolean
}

const StyledLink: React.FC<LinkProps> = ({
  href,
  onClick,
  children,
  showArrow = true,
}) => {
  const commonStyles: ThemeUIStyleObject = {
    color: 'blue',
    ':visited': { color: 'visitedPurple' },
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    textDecoration: 'underline',
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
