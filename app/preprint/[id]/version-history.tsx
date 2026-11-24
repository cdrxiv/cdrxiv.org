import React, { useEffect, useState } from 'react'
import { Box } from 'theme-ui'

import { formatDate } from '../../../utils/formatters'
import { getAdditionalField, getDataDownload } from '../../../utils/data'
import { Field, Link } from '../../../components'
import type { Preprint } from '../../../types/preprint'
import type {
  Deposition,
  DepositionVersion,
  VersionHistory,
} from '../../../types/zenodo'
import ErrorOrTrack from './error-or-track'
import { fetchDepositionHistory } from '../../../actions/zenodo'
import { fetchPublicRecordVersions } from '../../../utils/zenodo-public'

// Published versions are read from Zenodo's public API in the browser; fall
// back to the authenticated server action (e.g. when the record is a draft).
const fetchHistoryWithFallback = async (
  id: number,
): Promise<VersionHistory> => {
  try {
    return await fetchPublicRecordVersions(id)
  } catch {
    return fetchDepositionHistory(id)
  }
}

type Version = {
  date: string
  version: number
  href: string
}

const VersionsList: React.FC<{
  versions: Version[]
}> = ({ versions }) => {
  return (
    <>
      {versions.map(({ date, href, version }) => (
        <Box as='li' key={version} sx={{ variant: 'styles.li' }}>
          <Link href={href} sx={{ variant: 'text.mono' }}>
            {formatDate(new Date(date))}, v{version}
          </Link>
        </Box>
      ))}
    </>
  )
}

const VersionHistory: React.FC<{
  preprint: Preprint
  deposition?: Deposition | DepositionVersion
  preview?: boolean
}> = ({ deposition, preprint, preview }) => {
  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const [dataHistory, setDataHistory] = useState<VersionHistory>()
  const depositionId = deposition?.id

  useEffect(() => {
    if (depositionId) {
      fetchHistoryWithFallback(depositionId)
        .then(setDataHistory)
        .catch(() => {
          // Older versions are omitted when history is unavailable
        })
    }
  }, [depositionId])

  const olderVersions = hasArticle
    ? preprint.versions.slice(1).map((version) => ({
        date: version.date_time,
        href: version.public_download_url,
        version: version.version,
      }))
    : dataHistory &&
      dataHistory.hits.hits
        .filter((version) => version.submitted)
        .slice(1)
        .map((version, index) => ({
          date: version.modified,
          href: getDataDownload(version),
          version: dataHistory.hits.hits.length - index - 1,
        }))

  return olderVersions && olderVersions.length > 0 ? (
    <Field label='Older Versions'>
      <Box as='ul' sx={{ variant: 'styles.ul' }}>
        <VersionsList versions={olderVersions} />
      </Box>

      <ErrorOrTrack
        mt={2}
        hasError={
          !!dataHistory &&
          dataHistory.hits.hits[0].submitted &&
          dataHistory.hits.hits[0].id !== deposition?.id
        }
        preview={preview}
        pk={preprint.pk}
        errorMessage={
          'New version of data has been published, but has not been moved to CDRXIV_DATA_PUBLISHED.'
        }
      />

      <ErrorOrTrack
        mt={2}
        hasError={olderVersions.length !== preprint.versions.length - 1}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`This data submission has ${olderVersions.length + 1} published versions in Zenodo, but ${preprint.versions.length} versions have been published in Janeway. Visit the Janeway dashboard to ensure that the preprint has a version for each data update.`}
      />
    </Field>
  ) : null
}

export default VersionHistory
