import StyledLink from './link'
import type { Props } from './link'

export interface NavLinkProps extends Props {
  active: boolean
}
const NavLink: React.FC<NavLinkProps> = ({
  children,
  active,
  disabled,
  sx = {},
  ...props
}) => {
  const interactive = !disabled
  const ml = 'ml' in sx ? sx.ml : 0

  return (
    <StyledLink
      disabled={!interactive}
      {...props}
      sx={{
        color: 'text',
        ':visited': { color: 'text' },
        ':hover': interactive ? { color: 'blue' } : {},
        cursor: interactive ? 'pointer' : 'default',
        opacity: disabled ? 0.65 : 1,
        textDecoration: 'none',
        '::before': active
          ? { content: '">"', position: 'absolute', left: ml }
          : {},
        '&:hover::before': interactive
          ? { content: '">"', position: 'absolute', left: ml }
          : {},
        ...sx,
      }}
    >
      {children}
    </StyledLink>
  )
}

export default NavLink
