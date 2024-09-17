import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'

import PreprintViewer from '../../../preprint-viewer'
import { SupplementaryFile } from '../../../../types/preprint'
import { fetchDataDeposition } from '../../../../actions/zenodo'
import { fetchWithToken } from '../../../api/utils'
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
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/${params.preprint}`,
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

  const dataUrl = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_DRAFT',
  )?.url
  let deposition
  if (dataUrl) {
    deposition = await fetchDataDeposition(dataUrl)
  }

  const fileUrl = preprint.versions[0]?.public_download_url
  let previewUrl
  if (fileUrl) {
    previewUrl = fileUrl.replace('/repository/object/', '/repository/manager/')
  }

  return (
    <PreprintViewer
      preprint={preprint}
      deposition={deposition}
      previewUrl={previewUrl}
      preview
    />
  )
}

export default PreprintPreview
