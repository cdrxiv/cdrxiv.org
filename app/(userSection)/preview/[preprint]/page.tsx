import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'

import PreprintViewer from '../../../preprint-viewer'
import { fetchWithToken } from '../../../utils/fetch-with-token/server'
import Forbidden from '../forbidden'
import SharedLayout from '../../shared-layout'

// Polyfill for Promise.withResolvers
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function <T>(): {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: any) => void
  } {
    let resolve!: (value: T | PromiseLike<T>) => void
    let reject!: (reason?: any) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }
}

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
    headers(),
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprints/${params.preprint}`,
  )

  let preprint
  if (response.status !== 200) {
    return (
      <SharedLayout title='Preprint preview'>
        <Forbidden status={response.status} statusText={response.statusText} />
      </SharedLayout>
    )
  } else {
    preprint = await response.json()
  }

  return <PreprintViewer preprint={preprint} preview />
}

export default PreprintPreview
