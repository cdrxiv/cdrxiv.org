import { ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

import ResultsWrapper from './results-wrapper'
import PreprintsView from '../../preprints-view'
import { fetchWithAlerting } from '../../../actions/server-utils'
import { CHANNEL_PREFIX, CHANNELS } from '../../../utils/data'

interface Props {
  params: { id: string }
}

interface SearchProps extends Props {
  searchParams: { [key: string]: string | undefined }
}

const preprintsPerPage = 48

const Channel = async ({ searchParams, params }: SearchProps) => {
  const { query: search, view, ...rest } = searchParams // map query -> search and omit view from params passed to Janeway
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const offset = (page - 1) * preprintsPerPage
  const channel = CHANNELS.find(({ id }) => id === params.id)
  if (!channel) {
    redirect('/404')
  }

  const query = new URLSearchParams({
    search: `${CHANNEL_PREFIX}${params.id}`,
    ...rest,
    limit: preprintsPerPage.toString(),
    offset: offset.toString(),
  })

  const url = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?${query.toString()}`

  const res = await fetchWithAlerting(url, { next: { revalidate: 180 } })
  const preprints = await res.json()
  const results = preprints.results || []
  return (
    <ResultsWrapper
      count={preprints.count}
      label={channel.label}
      shortDescription='TK'
      description='TK'
    >
      <PreprintsView
        preprints={results}
        nextPage={preprints.next}
        totalCount={preprints.count}
        preprintsPerPage={preprintsPerPage}
      />
    </ResultsWrapper>
  )
}

export const generateMetadata = (
  { params }: Props,
  parent: ResolvingMetadata,
) => {
  const channel = CHANNELS.find(({ id }) => id === params.id)
  if (channel) {
    return {
      title: `${channel.label} – CDRXIV`,
      description: 'TK',
    }
  } else {
    return parent
  }
}

export default Channel
