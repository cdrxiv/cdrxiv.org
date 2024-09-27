'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { NavSidebar } from '../../components'
import { PATHS } from './constants'
import { NavigationProvider, useLinkWithWarning } from './navigation-context'
import PaneledPage from '../../components/layouts/paneled-page'
import { usePreprint } from './preprint-context'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { preprint } = usePreprint()
  const { onClick } = useLinkWithWarning()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0
  const active = PATHS[index]

  const handleDiscard = useCallback(() => {
    if (
      window.confirm(
        'This will delete your current submission and all related files. Are you sure want to proceed?',
      )
    ) {
      console.log('down here')
      // do something
      router.push('/')
    } else {
      console.log('here?')
    }
  }, [router])

  const { paths, count } = useMemo(() => {
    const visiblePaths = PATHS.filter((p) => !p.hidden)
    return {
      paths: [
        ...visiblePaths,
        {
          key: 'discard',
          href: '',
          title: '(X) Discard draft',
          sx: {
            variant: 'text.mono',
            color: 'blue',
            // textDecoration: 'underline',
            ':hover': {},
            '::before': {},
            '&:hover::before': {},
          },
          onClick: handleDiscard,
          public: true,
        },
      ],
      count: visiblePaths.length,
    }
  }, [handleDiscard])

  return (
    <PaneledPage
      title={active.title}
      rightCorner={active.hidden ? 'Success!' : `Step ${index + 1} / ${count}`}
      sidebar={<NavSidebar paths={paths} onClick={onClick} />}
    >
      {children}
    </PaneledPage>
  )
}

const SubmitLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // this wrapper allows use of useLinkWithWarning below
  return (
    <NavigationProvider>
      <Layout>{children}</Layout>
    </NavigationProvider>
  )
}

export default SubmitLayout
