import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import PreprintViewer from '../../../preprint/[id]/preprint-viewer'
import Forbidden from '../forbidden'
import SharedLayout from '../../shared-layout'
import { fetchWithToken } from '../../../../actions/server-utils'

import 'core-js/actual/promise/with-resolvers' // polyfill for react-pdf

const PreprintPreview = async ({
  params,
}: {
  params: { preprint: string }
}) => {
  const session = await getServerSession()
  if (!session?.user.email?.endsWith('@carbonplan.org')) {
    redirect('/account')
  }

  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprints/${params.preprint}`,
  )

  let preprint
  if (response.status !== 200) {
    return (
      <SharedLayout title='Preprint Preview'>
        <Forbidden status={response.status} statusText={response.statusText} />
      </SharedLayout>
    )
  } else {
    preprint = await response.json()
  }

  return <PreprintViewer preprint={preprint} preview />
}

export default PreprintPreview
