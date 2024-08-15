'use client'

import { useSession } from 'next-auth/react'
import { Flex } from 'theme-ui'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { Link } from '../../components'
import { PATHS } from './constants'
import { useLinkWithWarning } from './navigation-context'

interface Props {
  onClick?: () => Promise<boolean> | boolean
}

interface ButtonProps extends Props {
  href: string
  direction: 'forward' | 'back'
  children: React.ReactNode
}

const NavButton: React.FC<ButtonProps> = ({
  onClick,
  href,
  direction,
  children,
}) => {
  const router = useRouter()
  const { onClick: onClickWithWarning } = useLinkWithWarning(href)

  const props = {
    [direction === 'forward' ? 'forwardArrow' : 'backArrow']: true,
  }

  const onClickProp = onClick
    ? async () => {
        const result = await onClick()
        if (result) {
          router.push(href)
        }
      }
    : onClickWithWarning

  return (
    <Link {...props} onClick={onClickProp} sx={{ variant: 'text.monoCaps' }}>
      {children}
    </Link>
  )
}

const stripParams = (pathname: string): string => {
  return pathname.replace(/\/\d+/g, '')
}

const NextButton: React.FC<ButtonProps> = ({ href, ...props }) => {
  const { status } = useSession()

  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  if (disabled) return null

  return <NavButton href={href} {...props} />
}

const NavButtons: React.FC<Props> = ({ onClick }) => {
  const pathname = usePathname()
  const params = useParams()
  let index = PATHS.findIndex((p) => p.href === stripParams(pathname))
  index = index >= 0 ? index : 0

  return (
    <Flex
      sx={{
        justifyContent: index > 0 ? 'space-between' : 'flex-end',
        mt: 8,
      }}
    >
      {index > 0 && (
        <NavButton
          href={`${PATHS[index - 1].href}${params.preprint ? `/${params.preprint[0]}` : ''}`}
          direction='back'
        >
          Prev step
        </NavButton>
      )}
      {index < PATHS.length - 1 && (
        <NextButton
          href={`${PATHS[index + 1].href}${params.preprint ? `/${params.preprint[0]}` : ''}`}
          onClick={onClick}
          direction='forward'
        >
          Next step
        </NextButton>
      )}
    </Flex>
  )
}

export default NavButtons
