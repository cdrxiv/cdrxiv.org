import StyledLink from './link'
import type { Props } from './link'

const carrot = {
  content: '">"',
  position: 'absolute',
  left: -3,
}
interface NavLinkProps extends Props {
  active: boolean
}
const NavLink: React.FC<NavLinkProps> = ({
  children,
  active,
  sx = {},
  ...props
}) => {
  return (
    <StyledLink
      disabled={active}
      {...props}
      sx={{
        ...sx,
        color: 'text',
        ':visited': { color: 'text' },
        ':hover': active ? {} : { color: 'blue' },
        textDecoration: 'none',
        '::before': active
          ? { content: '">"', position: 'absolute', left: -3 }
          : {},
        '&:hover::before': { content: '">"', position: 'absolute', left: -3 },
      }}
    >
      {children}
    </StyledLink>
  )
}

export default NavLink
