import { notFound } from 'next/navigation'
import { ResolvingMetadata } from 'next'

import PreprintViewer from './preprint-viewer'
import { fetchWithAlerting } from '../../../actions/server-utils'
import { Preprint } from '../../../types/preprint'

import { Preprint } from '../../../types/preprint'

const getPreprint = async (id: string): Promise<Preprint | null> => {
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
    if (preprint && preprint.date_published) {
      const date = new Date(preprint.date_published)
      return {
        title: `${preprint.title} – CDRXIV`,
        description: preprint.abstract,
        other: {
          citation_journal_title: 'CDRXIV',
          citation_title: preprint.title,
          citation_author: preprint.authors.map((a) =>
            [a.first_name, a.middle_name, a.last_name]
              .filter(Boolean)
              .join(' ')
              .trim(),
          ),
          citation_publication_date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
          citation_pdf_url: preprint.versions[0].public_download_url,
        },
      }
    } else {
      return parent
    }
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
