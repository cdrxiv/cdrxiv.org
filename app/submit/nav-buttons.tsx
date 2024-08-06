'use client'

import { useSession } from 'next-auth/react'
import { Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'

import StyledLink, { Props as LinkProps } from '../../components/link'
import { PATHS } from './constants'

const NextButton: React.FC<LinkProps> = ({ href, ...props }) => {
  const { status } = useSession()

  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  if (disabled) return null

  return <StyledLink href={href} {...props} />
}

const NavButtons: React.FC<{}> = () => {
  const pathname = usePathname()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0

  return (
    <Flex
      sx={{
        justifyContent: index > 0 ? 'space-between' : 'flex-end',
        mt: 8,
      }}
    >
      {index > 0 && (
        <StyledLink
          href={PATHS[index - 1].href}
          backArrow
          sx={{ variant: 'text.monoCaps' }}
        >
          Prev step
        </StyledLink>
      )}
      {index < PATHS.length - 1 && (
        <NextButton
          href={PATHS[index + 1].href}
          forwardArrow
          sx={{ variant: 'text.monoCaps' }}
        >
          Next step
        </NextButton>
      )}
    </Flex>
  )
}

export default NavButtons
