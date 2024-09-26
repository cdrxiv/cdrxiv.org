import React, { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { formatDate } from '../utils/formatters'
import { getAdditionalField, getFunders, getZenodoLicense } from '../utils/data'
import { Field, Button, Link } from '../components'
import type { Preprint, Funder, SupplementaryFile } from '../types/preprint'
import type { Deposition } from '../types/zenodo'
import useTracking from '../hooks/use-tracking'
import { fetchDataDeposition } from '../actions/zenodo'

const getDataDownload = (deposition: Deposition) => {
  return `${process.env.NEXT_PUBLIC_ZENODO_URL}/records/${deposition.id}/files/${deposition.files[0].filename}?download=1`
}

const LICENSE_DISPLAY = {
  'cc-by-nc-4.0': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    name: 'CC BY-NC 4.0',
  },
  'cc-by-4.0': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    name: 'CC BY 4.0',
  },
}

const ErrorOrTrack = ({
  hasError,
  preview,
  errorMessage,
  pk,
  mt = 0,
}: {
  hasError: boolean
  preview?: boolean
  errorMessage: string
  pk: number
  mt?: number
}) => {
  const track = useTracking()

  useEffect(() => {
    // track error when present and viewing outside of preview setting
    if (!preview && hasError) {
      track('preprint_metadata_error', { error: errorMessage, preprint: pk })
    }
  }, [track, preview, hasError, errorMessage, pk])

  if (preview && hasError) {
    // in preview setting, render error message for repository manager to triage when an error is present
    return <Box sx={{ variant: 'styles.error', mt }}>{errorMessage}</Box>
  }

  // otherwise do not render
  return null
}

const PreprintMetadata: React.FC<{
  preprint: Preprint
  deposition?: Deposition
  preview?: boolean
}> = ({ preprint, preview }) => {
  const [deposition, setDeposition] = useState<Deposition>()

  useEffect(() => {
    const fetchDeposition = async () => {
      const dataUrl = preprint.supplementary_files.find(
        (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_PUBLISHED',
      )?.url
      if (dataUrl) {
        const deposition = await fetchDataDeposition(dataUrl)
        setDeposition(deposition)
      }
    }
    fetchDeposition()
  }, [preprint])

  const funders = getFunders(preprint) ?? []

  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const hasData = ['Data', 'Both'].includes(submissionType ?? '')
  const hasDraft = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const conflictOfInterest = getAdditionalField(
    preprint,
    'Conflict of interest statement',
  )
  const dataLicense = getAdditionalField(preprint, 'Data license')
  const dataLicenseInfo = getZenodoLicense(preprint)
  const hasConflictOfInterest =
    conflictOfInterest && conflictOfInterest !== 'None'

  return (
    <Flex sx={{ flexDirection: 'column', mt: 5, gap: 9 }}>
      <ErrorOrTrack
        hasError={!hasArticle && !hasData}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`Invalid submissionType: “${submissionType}” found.`}
      />
      <ErrorOrTrack
        hasError={hasData && !deposition}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`No data deposition found. Update submission type or add data before
          publishing.`}
      />
      <ErrorOrTrack
        hasError={preprint.versions.length == 0}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`No versions found. Versions must be created in the Janeway dashboard.`}
      />

      <Field label='Pathways'>
        {preprint.subject.map(({ name }) => (
          <Link
            key={name}
            href={`/?subject=${name}`}
            forwardArrow
            sx={{
              variant: 'text.mono',
              display: 'block',
            }}
          >
            {name}
          </Link>
        ))}
        <ErrorOrTrack
          hasError={preprint.subject.length === 0}
          preview={preview}
          pk={preprint.pk}
          errorMessage={`No subjects provided.`}
        />
      </Field>

      <Flex sx={{ flexDirection: 'column', gap: 5 }}>
        {hasArticle && (
          <Box>
            <Button href={preprint.versions[0]?.public_download_url}>
              Download (PDF)
            </Button>
            <ErrorOrTrack
              mt={2}
              hasError={
                hasArticle && !preprint.versions[0]?.public_download_url
              }
              preview={preview}
              pk={preprint.pk}
              errorMessage={'No article download URL found.'}
            />
          </Box>
        )}
        {hasData && (
          <Box>
            <Button
              disabled={!(deposition?.submitted || preview)}
              href={deposition && getDataDownload(deposition)}
            >
              Download (data)
            </Button>
            <ErrorOrTrack
              mt={2}
              hasError={hasData && !deposition}
              preview={preview}
              pk={preprint.pk}
              errorMessage={
                hasDraft
                  ? "Data stored under 'CDRXIV_DATA_DRAFT' in supplementary files, but must be moved to 'CDRXIV_DATA_PUBLISHED'."
                  : 'Data missing in supplementary files.'
              }
            />
            <ErrorOrTrack
              mt={2}
              hasError={!!deposition && !deposition.submitted}
              preview={preview}
              pk={preprint.pk}
              errorMessage={'Data deposition not published.'}
            />
          </Box>
        )}

        {preprint.versions.length > 1 && (
          <Field label='Older Versions'>
            <Box
              as='ul'
              sx={{
                variant: 'styles.ul',
              }}
            >
              {preprint.versions.slice(1).map((version) => (
                <Box
                  as='li'
                  key={version.version}
                  sx={{ variant: 'styles.li' }}
                >
                  <Link
                    href={version.public_download_url}
                    sx={{ variant: 'text.mono' }}
                  >
                    {formatDate(new Date(version.date_time))}, v
                    {version.version}
                  </Link>
                </Box>
              ))}
            </Box>
          </Field>
        )}
      </Flex>

      <Field label='Funders'>
        {funders.map((item: Funder) => (
          <Box
            key={`${item.funder}-${item.award}`}
            sx={{ variant: 'text.mono' }}
          >
            {item.funder} {item.award ? `(${item.award})` : ''}
          </Box>
        ))}
        {funders.length === 0 && (
          <Box sx={{ variant: 'text.mono', color: 'listBorderGrey' }}>None</Box>
        )}
      </Field>

      <Field label='License'>
        <Flex sx={{ gap: 2, variant: 'text.mono' }}>
          <Link href={preprint.license?.url} sx={{ variant: 'text.mono' }}>
            {preprint.license?.short_name}
          </Link>
          {submissionType === 'Both' ? '(Article)' : null}
        </Flex>
        <ErrorOrTrack
          mt={2}
          hasError={!preprint.license}
          preview={preview}
          pk={preprint.pk}
          errorMessage={'No license provided.'}
        />
        {submissionType === 'Both' && (
          <>
            {dataLicenseInfo && (
              <Flex sx={{ gap: 2, variant: 'text.mono' }}>
                <Link href={dataLicenseInfo.url} sx={{ variant: 'text.mono' }}>
                  {dataLicenseInfo.name}
                </Link>
                (Data)
              </Flex>
            )}
            <ErrorOrTrack
              mt={2}
              hasError={!dataLicenseInfo}
              preview={preview}
              pk={preprint.pk}
              errorMessage={
                dataLicense
                  ? `Invalid data license found: ${dataLicense}`
                  : 'No data license provided.'
              }
            />
          </>
        )}
      </Field>

      {preprint.keywords.length > 0 && (
        <Field label='Keywords'>
          <Box sx={{ variant: 'text.mono' }}>
            {preprint.keywords.map(({ word }, index, array) => (
              <React.Fragment key={word}>
                <Link
                  href={`/search?query=${word}`}
                  sx={{ display: 'inline', variant: 'text.mono' }}
                >
                  {word}
                </Link>
                {index < array.length - 1 && ', '}
              </React.Fragment>
            ))}
          </Box>
        </Field>
      )}

      {hasConflictOfInterest && (
        <Field label='Conflict of interest'>
          <Box sx={{ variant: 'text.body', fontSize: 2 }}>
            {conflictOfInterest}
          </Box>
        </Field>
      )}
    </Flex>
  )
}

export default PreprintMetadata
