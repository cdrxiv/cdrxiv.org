import React from 'react'
import { Link } from 'theme-ui'

type LinkProps = {
  href: string
  children: React.ReactNode
}

const StyledLink = ({ href, children }: LinkProps) => {
  return (
    <Link
      sx={{ color: 'blue', ':visited': { color: 'visitedPurple' } }}
      href={href}
    >
      {children} {'>>'}
    </Link>
  )
}

export default StyledLink
