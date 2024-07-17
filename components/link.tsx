import React from 'react'
import { Link } from 'theme-ui'

type LinkProps = {
  href: string
  children: React.ReactNode
  showArrow?: boolean
}

const StyledLink = ({ href, children, showArrow = true }: LinkProps) => {
  return (
    <Link
      sx={{ color: 'blue', ':visited': { color: 'visitedPurple' } }}
      href={href}
    >
      {children} {showArrow && '>>'}
    </Link>
  )
}

export default StyledLink
