'use client'

import { Flex } from 'theme-ui'
import PaneledPage from '../../../components/layouts/paneled-page'

export default function NotFound() {
  return (
    <PaneledPage>
      <Flex sx={{ justifyContent: 'center', alignItems: 'center', my: 150 }}>
        Preprint not found
      </Flex>
    </PaneledPage>
  )
}
