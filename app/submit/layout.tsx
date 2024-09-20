'use client'

import { usePathname } from 'next/navigation'

import { NavSidebar } from '../../components'
import { PATHS } from './constants'
import { NavigationProvider, useLinkWithWarning } from './navigation-context'
import PaneledPage from '../../components/layouts/paneled-page'

const Submit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // this wrapper allows use of useLinkWithWarning below
  return (
    <NavigationProvider>
      <SubmitContent>{children}</SubmitContent>
    </NavigationProvider>
  )
}

const SubmitContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname()
  const { onClick } = useLinkWithWarning()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0
  const active = PATHS[index]

  const visiblePaths = PATHS.filter((p) => !p.hidden)

  return (
    <PaneledPage
      title={active.title}
      rightCorner={
        active.hidden
          ? 'Success!'
          : `Step ${index + 1} / ${visiblePaths.length}`
      }
      sidebar={<NavSidebar paths={visiblePaths} onClick={onClick} />}
    >
      {children}
    </PaneledPage>
  )
}

export default Submit
