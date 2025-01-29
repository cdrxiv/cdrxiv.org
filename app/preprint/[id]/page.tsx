import { notFound } from 'next/navigation'
import { ResolvingMetadata } from 'next'

import PreprintViewer from './preprint-viewer'
import { fetchWithAlerting } from '../../../actions/server-utils'

import 'core-js/actual/promise/with-resolvers' // polyfill for react-pdf

const getPreprint = async (id: string) => {
  const res = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/${id}`,
    { next: { revalidate: 180 } },
    [200, 404],
  )
  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`API request failed with status ${res.status}`)
  }
  return res.json()
}

type Props = { params: { id: string } }

export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata,
) => {
  try {
    const preprint = await getPreprint(params.id)
    return preprint
      ? {
          title: `${preprint.title} – CDRXIV`,
          description: preprint.abstract,
        }
      : parent
  } catch {
    return parent
  }
}

const PreprintsPage = async ({ params }: Props) => {
  const preprint = await getPreprint(params.id)
  if (!preprint) {
    notFound()
  }
  return <PreprintViewer preprint={preprint} />
}

export default PreprintsPage
