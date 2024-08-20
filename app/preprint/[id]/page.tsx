import { notFound } from 'next/navigation'
import PdfViewer from './pdf-viewer'

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
  return <PdfViewer preprint={preprint} />
}

export default PreprintsPage
