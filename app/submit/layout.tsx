'use client'

import { usePathname } from 'next/navigation'

import { NavSidebar } from '../../components'
import { PATHS } from './constants'
import { NavigationProvider } from './navigation-context'
import PaneledPage from '../../components/layouts/paneled-page'

const Submit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0
  const active = PATHS[index]

  const visiblePaths = PATHS.filter((p) => !p.hidden)

  return (
    <NavigationProvider>
      <PaneledPage
        title={active.title}
        rightCorner={
          active.hidden
            ? 'Success!'
            : `Step ${index + 1} / ${visiblePaths.length}`
        }
        sidebar={<NavSidebar paths={visiblePaths} linkWarning />}
      >
        {children}
      </PaneledPage>
    </NavigationProvider>
  )
}

export default Submit
