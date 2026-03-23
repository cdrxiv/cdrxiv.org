import { ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

import ResultsWrapper from './results-wrapper'
import PreprintsView from '../../preprints-view'
import { fetchWithAlerting } from '../../../actions/server-utils'
import {
  CHANNEL_PREFIX,
  CHANNELS,
  getAdditionalField,
} from '../../../utils/data'
import { Preprint } from '../../../types/preprint'

interface Props {
  params: { id: string }
}

interface SearchProps extends Props {
  searchParams: { [key: string]: string | undefined }
}

const preprintsPerPage = 48
const CHANNEL_TEXT = {
  ycncc: {
    shortDescription:
      'Scientific research center at Yale exploring how natural systems can be enhanced and scaled to mitigate climate change.',
    description: (
      <>
        These submissions are part of the Yale Center for Natural Carbon
        Capture’s (<a href='https://naturalcarboncapture.yale.edu/'>YCNCC</a>)
        work to advance fundamental and applied science on enhancing natural
        Earth systems to reduce greenhouse gas concentrations in the atmosphere.
        The YCNCC mission emphasizes the responsible implementation and scaling
        of methods of climate mitigation that are safe, effective, and scalable,
        while prioritizing ecological, economic, and social co-drivers.
      </>
    ),
  },
  cascade: {
    shortDescription:
      'An enhanced rock weathering data-sharing system accelerating scientific progress. Proactively sharing commercial and academic field data for the benefit of broad scientific learning while protecting farmer privacy and commercial rights.',
    description: (
      <>
        <p>
          The ERW Data Quarry shares both commercial and academic enhanced rock
          weathering (ERW) field data for the benefit of broad scientific
          learning in the CDR space. Multiple ERW companies have committed to
          sharing specific datasets from one or more deployments within a set
          timeframe. Catalytic ERW buyers also require dataset contributions to
          the Data Quarry as part of ERW purchases. This signals the importance
          of community-wide data sharing in growing a quality ERW market.
        </p>
        <p>
          Datasets are uploaded as they become available. Health and safety data
          from every contributing dataset are made fully public on CDRXIV in
          order to build trust in the safety of ERW. Additional data are made
          available to researchers through a proposal-based request system
          managed at{' '}
          <a href='https://data.cascadeclimate.org'>
            https://data.cascadeclimate.org
          </a>
          . If a Data Quarry dataset is used in an academic peer-review
          publication, the dataset will be released publicly upon peer reviewed
          article publication.
        </p>
      </>
    ),
  },
}

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
  const results =
    preprints.results?.filter(
      (p: Preprint) =>
        getAdditionalField(p, 'Channel(s) status') === 'Approved',
    ) || []

  const diff = preprints.results?.length - results.length

  return (
    <ResultsWrapper
      count={
        // imperfect count when filtered preprints are spread across pages
        preprints.count - diff
      }
      label={channel.label}
      shortDescription={CHANNEL_TEXT[channel.id].shortDescription}
      description={CHANNEL_TEXT[channel.id].description}
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
