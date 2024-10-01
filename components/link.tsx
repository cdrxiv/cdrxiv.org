import React from 'react'
import { Link as ThemeUILink, LinkProps } from 'theme-ui'
import NextLink from 'next/link'

export interface Props extends LinkProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  forwardArrow?: boolean
  backArrow?: boolean
  disabled?: boolean
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
}

const StyledLink: React.FC<Props> = ({
  href,
  onClick,
  children,
  backArrow = false,
  forwardArrow = false,
  sx: sxProp,
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
      <ThemeUILink
        onClick={handleClick}
        sx={{
          ...(disabled ? sx.disabled : {}),
          ...(!href ? sx.button : {}),
          ...sxProp,
        }}
        {...props}
      >
        {content}
      </ThemeUILink>
    </NextLink>
  )
}

export default StyledLink
