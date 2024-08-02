import React from 'react'
import { Box, Button, Link, ThemeUIStyleObject } from 'theme-ui'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  sx?: ThemeUIStyleObject
}

type Ref = HTMLButtonElement | HTMLAnchorElement

const StyledButton = React.forwardRef<Ref, ButtonProps>(
  ({ children, onClick, href, sx = {} }, ref) => {
    const commonStyles: ThemeUIStyleObject = {
      variant: 'text.monoCaps',
      cursor: 'pointer',
      color: 'blue',
      background: 'primary',
      borderRadius: 0,
      border: '1px solid',
      borderColor: 'background',
      boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.muted} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.text} inset`,
      outline: 'none',
      ':focus-visible': {
        borderColor: 'blue',
      },
      ':active': {
        boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.text} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.muted} inset`,
        '& > div': {
          transform: 'translate(1px, 1px)',
        },
      },
      pb: ['9px', '9px', '9px', '11px'],
      ...sx,
    }

    const buttonContent = (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={href ? undefined : onClick}
        sx={commonStyles}
      >
        <Box>{children}</Box>
      </Button>
    )

    return href ? (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        sx={{
          textDecoration: 'none',
        }}
      >
        {buttonContent}
      </Link>
    ) : (
      buttonContent
    )
  },
)

StyledButton.displayName = 'StyledButton'

export default StyledButton
