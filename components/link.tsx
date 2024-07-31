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
      <ThemeUILink onClick={handleClick} sx={commonStyles} {...props}>
        {content}
      </ThemeUILink>
    </NextLink>
  )
}

export default StyledLink
