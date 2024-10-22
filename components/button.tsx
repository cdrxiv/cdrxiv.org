import React from 'react'
import { Box, Button, Link, ButtonProps, ThemeUIStyleObject } from 'theme-ui'

interface Props extends ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  sx?: ThemeUIStyleObject
}

type Ref = HTMLButtonElement | HTMLAnchorElement

const StyledButton = React.forwardRef<Ref, Props>(
  ({ children, onClick, href, sx = {}, ...props }, ref) => {
    const commonStyles: ThemeUIStyleObject = {
      variant: 'text.monoCaps',
      cursor: 'pointer',
      color: 'blue',
      background: 'primary',
      borderRadius: 0,
      boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.muted} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.text} inset`,
      outline: 'none',
      ':focus-visible': {
        outline: '1px solid blue',
      },
      ':active': {
        boxShadow: (theme) => `1px 1px 0px 1px ${theme?.colors?.text} inset, 
                  -1px -1px 0px 1px ${theme?.colors?.muted} inset`,
        '& > div': {
          transform: 'translate(1px, 1px)',
        },
      },
      pb: ['9px', '9px', '9px', '11px'],
      '&:disabled': {
        background: 'background',
        boxShadow:
          '1px 1px 0px 1px #c5bbbb inset, -1px -1px 0px 1px #E8E8E8 inset',
        cursor: 'not-allowed',
      },
      ...sx,
    }

    const buttonContent = (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={href ? undefined : onClick}
        sx={commonStyles}
        {...props}
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
