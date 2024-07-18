import React from 'react'
import { Link } from 'theme-ui'

type LinkProps = {
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
  showArrow?: boolean
}

const StyledLink = ({
  href,
  onClick,
  children,
  showArrow = true,
}: LinkProps) => {
  const linkProps = href ? { href } : { as: 'button', onClick }

  return (
    <Link
      sx={{
        color: 'blue',
        ':visited': { color: 'visitedPurple' },
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        textDecoration: 'underline',
      }}
      {...linkProps}
    >
      {children} {showArrow && '>>'}
    </Link>
  )
}

export default StyledLink
