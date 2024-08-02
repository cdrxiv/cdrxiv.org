import React from 'react'
import { Link as ThemeUILink, ThemeUIStyleObject, LinkProps } from 'theme-ui'
import NextLink from 'next/link'

export interface Props extends LinkProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  forwardArrow?: boolean
  backArrow?: boolean
  disabled?: boolean
}

const StyledLink: React.FC<Props> = ({
  href,
  onClick,
  children,
  backArrow = false,
  forwardArrow = false,
  sx,
  disabled = false,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    if (onClick) {
      event.preventDefault()
      onClick(event)
    }
  }

  const content = (
    <>
      {backArrow && '<< '}
      {children}
      {forwardArrow && ' >>'}
    </>
  )

  return (
    <NextLink href={disabled ? '#' : href || '#'} passHref legacyBehavior>
      <ThemeUILink onClick={handleClick} sx={sx} {...props}>
        {content}
      </ThemeUILink>
    </NextLink>
  )
}

export default StyledLink
