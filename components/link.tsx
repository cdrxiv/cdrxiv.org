import React from 'react'
import { Link, Button, ThemeUIStyleObject, LinkProps } from 'theme-ui'

export interface Props extends LinkProps {
  disabled?: boolean
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void
  showArrow?: boolean
}

const StyledLink: React.FC<Props> = ({
  href,
  onClick,
  children,
  showArrow = false,
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
      <Link href={href} sx={commonStyles} {...props}>
        {children}
        {showArrow && ' >>'}
      </Link>
    )
  }

  return (
    <Button onClick={onClick} sx={commonStyles} disabled={props.disabled}>
      {children}
      {showArrow && ' >>'}
    </Button>
  )
}

export default StyledLink
