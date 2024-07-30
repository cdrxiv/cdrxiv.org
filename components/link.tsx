import React from 'react'
import {
  Link as ThemeUILink,
  Button,
  ThemeUIStyleObject,
  LinkProps,
} from 'theme-ui'
import NextLink from 'next/link'

export interface Props extends LinkProps {
  disabled?: boolean
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void
  forwardArrow?: boolean
  backArrow?: boolean
}

const StyledLink: React.FC<Props> = ({
  href,
  onClick,
  children,
  backArrow = false,
  forwardArrow = false,
  sx,
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

  if (href !== undefined) {
    return (
      <NextLink href={href} passHref={true} legacyBehavior>
        <ThemeUILink sx={commonStyles} {...props}>
          {backArrow && '<< '}
          {children}
          {forwardArrow && ' >>'}
        </ThemeUILink>
      </NextLink>
    )
  }

  return (
    <Button onClick={onClick} sx={commonStyles} disabled={props.disabled}>
      {backArrow && '<< '}
      {children}
      {forwardArrow && ' >>'}
    </Button>
  )
}

export default StyledLink
