'use client'

import { useSession } from 'next-auth/react'
import { Flex } from 'theme-ui'
import { usePathname, useRouter } from 'next/navigation'

import { Link } from '../../components'
import { PATHS } from './constants'
import { useLinkWithWarning } from './navigation-context'
import { useLoading } from '../../components/layouts/paneled-page'

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
  const { setIsLoading } = useLoading()
  const { onClick: onClickWithWarning } = useLinkWithWarning()

  const props = {
    [direction === 'forward' ? 'forwardArrow' : 'backArrow']: true,
  }

  const onClickProp = onClick
    ? async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await onClick()
        if (result) {
          router.push(href) // loading off handled in paneled-page
        } else {
          setIsLoading(false)
        }
      }
    : onClickWithWarning

  return (
    <Link
      {...props}
      href={href}
      onClick={onClickProp}
      sx={{ variant: 'text.monoCaps' }}
    >
      {children}
    </Link>
  )
}

const NextButton: React.FC<ButtonProps> = ({ href, ...props }) => {
  const { status } = useSession()

  const disabled = status === 'unauthenticated' && href !== PATHS[0].href

  if (disabled) return null

  return <NavButton href={href} {...props} />
}

const NavButtons: React.FC<Props> = ({ onClick }) => {
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
        <NavButton href={PATHS[index - 1].href} direction='back'>
          Prev step
        </NavButton>
      )}
      {index < PATHS.length - 1 && !PATHS[index + 1]?.hidden && (
        <NextButton
          href={PATHS[index + 1].href}
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
