import React from 'react'
import { Link as ThemeUILink, LinkProps } from 'theme-ui'
import NextLink from 'next/link'
import type { LinkProps as NextLinkProps } from 'next/link'

export interface Props extends LinkProps, Pick<NextLinkProps, 'prefetch'> {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  forwardArrow?: boolean
  backArrow?: boolean
  disabled?: boolean
  selected?: boolean
  hoverEffect?: boolean
}

const sx = {
  disabled: {
    cursor: 'text',
    color: 'listBorderGrey',
    textDecoration: 'none',
  },
  button: {
    ':visited': { color: 'blue' },
  },
  hover: {
    ':hover': {
      textDecorationThickness: '0.12em',
    },
  },
  selected: {
    textDecorationThickness: '0.12em',
  },
}

const StyledLink: React.FC<Props> = ({
  href,
  onClick,
  children,
  backArrow = false,
  forwardArrow = false,
  sx: sxProp,
  disabled = false,
  selected = false,
  hoverEffect = false,
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
      {backArrow && <>{'<<'}&nbsp;</>}
      {children}
      {forwardArrow && <>&nbsp;{'>>'}</>}
    </>
  )

  return (
    <ThemeUILink
      as={NextLink}
      href={disabled ? '#' : href || '#'}
      onClick={handleClick}
      role={onClick && !href ? 'button' : undefined}
      sx={{
        ...(disabled ? sx.disabled : {}),
        ...(!href ? sx.button : {}),
        ...(hoverEffect ? sx.hover : {}),
        ...(selected ? sx.selected : {}),
        ...sxProp,
      }}
      {...props}
    >
      {content}
    </ThemeUILink>
  )
}

export default StyledLink
