import React, { useEffect, useState } from 'react'
import { Box } from 'theme-ui'

import { formatDate } from '../../../utils/formatters'
import { getAdditionalField } from '../../../utils/data'
import { Field, Link } from '../../../components'
import type { Preprint } from '../../../types/preprint'
import type {
  Deposition,
  DepositionVersion,
  VersionHistory,
} from '../../../types/zenodo'
import ErrorOrTrack from './error-or-track'
import { fetchDepositionHistory } from '../../../actions/zenodo'

const getDataDownload = (deposition: DepositionVersion) => {
  return `${process.env.NEXT_PUBLIC_ZENODO_URL}/records/${deposition.id}/files/${deposition.files[0].key}?download=1`
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
  deposition?: Deposition
  preview?: boolean
}> = ({ deposition, preprint, preview }) => {
  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const [dataHistory, setDataHistory] = useState<VersionHistory>()

  useEffect(() => {
    if (deposition) {
      fetchDepositionHistory(deposition).then((history) => {
        setDataHistory(history)
      })
    }
  }, [deposition])

  const hasOlderVersions = hasArticle
    ? preprint.versions.length > 1
    : dataHistory && dataHistory.hits.hits.length > 1

  return hasOlderVersions ? (
    <Field label='Older Versions'>
      <Box
        as='ul'
        sx={{
          variant: 'styles.ul',
        }}
      >
        {hasArticle ? (
          <VersionsList
            versions={preprint.versions.slice(1).map((version) => ({
              date: version.date_time,
              href: version.public_download_url,
              version: version.version,
            }))}
          />
        ) : (
          <VersionsList
            versions={
              dataHistory
                ? dataHistory.hits.hits
                    .slice(1)
                    .filter((version) => version.submitted)
                    .map((version, index) => ({
                      date: version.modified,
                      href: getDataDownload(version),
                      version: dataHistory.hits.hits.length - index - 1,
                    }))
                : []
            }
          />
        )}
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
    </Field>
  ) : null
}

export default VersionHistory
