'use client'

import { Flex } from 'theme-ui'
import { usePathname } from 'next/navigation'
import PaneledPage from '../components/layouts/paneled-page'

export default function NotFound() {
  const pathname = usePathname()
  return (
    <PaneledPage>
      <Flex sx={{ justifyContent: 'center', alignItems: 'center', my: 150 }}>
        {pathname.match(/\/preprint\/\d+/)
          ? 'Preprint not found'
          : 'Page not found'}
      </Flex>
    </PaneledPage>
  )
}
