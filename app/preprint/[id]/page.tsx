import { notFound } from 'next/navigation'
import PreprintViewer from './preprint-viewer'
import { SupplementaryFile } from '../../../types/preprint'
import { fetchDataDeposition } from '../../../actions/zenodo'

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

const getPreprint = async (id: string) => {
  const res = await fetch(
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/published_preprints/${id}`,
  )
  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`API request failed with status ${res.status}`)
  }
  return res.json()
}

const PreprintsPage = async ({ params }: { params: { id: string } }) => {
  const preprint = await getPreprint(params.id)
  if (!preprint) {
    notFound()
  }

  const dataUrl = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_PUBLISHED',
  )?.url
  let deposition
  if (dataUrl) {
    deposition = await fetchDataDeposition(dataUrl)
  }
  return <PreprintViewer preprint={preprint} deposition={deposition} />
}

export default PreprintsPage
