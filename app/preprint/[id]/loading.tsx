'use client'

import { Flex } from 'theme-ui'
import { Loading } from '../../../components'
import PaneledPage from '../../../components/layouts/paneled-page'

export default function PreprintLoading() {
  return (
    <PaneledPage sidebar={<></>}>
      <Flex sx={{ justifyContent: 'center', alignItems: 'center', my: 150 }}>
        <Loading />
      </Flex>
    </PaneledPage>
  )
}
