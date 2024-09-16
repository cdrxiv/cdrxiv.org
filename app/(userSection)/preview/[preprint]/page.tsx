import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

import PreprintViewer from '../../../preprint-viewer'
import { SupplementaryFile } from '../../../../types/preprint'
import { fetchDataDeposition } from '../../../../actions/zenodo'
import { fetchWithToken } from '../../../api/utils'

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

const getPreprint = async (preprint: string) => {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/${preprint}`,
  )

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`API request failed with status ${res.status}`)
  }
  return res.json()
}

const PreprintPreview = async ({
  params,
}: {
  params: { preprint: string }
}) => {
  const preprint = await getPreprint(params.preprint)
  if (!preprint) {
    notFound()
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
