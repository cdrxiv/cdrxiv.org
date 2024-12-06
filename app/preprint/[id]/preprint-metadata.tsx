import React from 'react'
import { Box, Flex } from 'theme-ui'

import {
  getAdditionalField,
  getArticleLicense,
  getFunders,
  getZenodoLicense,
} from '../../../utils/data'
import { Field, Button, Link, Loading } from '../../../components'
import type {
  Preprint,
  Funder,
  SupplementaryFile,
} from '../../../types/preprint'
import type { Deposition } from '../../../types/zenodo'
import ErrorOrTrack from './error-or-track'
import VersionHistory from './version-history'
import { formatDate } from '../../../utils/formatters'

const getDataDownload = (deposition: Deposition) => {
  return `${process.env.NEXT_PUBLIC_ZENODO_URL}/records/${deposition.id}/files/${deposition.files[0].filename}?download=1`
}

const PreprintMetadata: React.FC<{
  preprint: Preprint
  deposition?: Deposition
  isDepositionLoading: boolean
  preview?: boolean
}> = ({ deposition, isDepositionLoading, preprint, preview }) => {
  const dataUrl = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_PUBLISHED',
  )?.url
  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const hasData = ['Data', 'Both'].includes(submissionType ?? '')
  const hasDraft = preprint.supplementary_files.find(
    (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const externalData = preprint.supplementary_files.find(
    (file: SupplementaryFile) => !file.label.startsWith('CDRXIV_DATA_'),
  )

  const funders = getFunders(preprint) ?? []

  const conflictOfInterest = getAdditionalField(
    preprint,
    'Conflict of interest statement',
  )
  const dataLicense = getAdditionalField(preprint, 'Data license')
  const dataLicenseInfo = getZenodoLicense(preprint)
  const articleLicenseInfo = getArticleLicense(preprint.license?.pk)
  const hasConflictOfInterest =
    conflictOfInterest && conflictOfInterest !== 'None'

  return (
    <Flex sx={{ flexDirection: 'column', gap: [6, 8, 9, 9] }}>
      <ErrorOrTrack
        hasError={!hasArticle && !hasData}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`Invalid submissionType: “${submissionType}” found.`}
      />
      <ErrorOrTrack
        hasError={preprint.versions.length == 0}
        preview={preview}
        pk={preprint.pk}
        errorMessage={`No versions found. Versions must be created in the Janeway dashboard.`}
      />

      <Field label='Topics'>
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
              sx={{
                textAlign: isDepositionLoading ? 'left' : 'center',
                width: [129, 129, 146, 164],
              }}
            >
              {isDepositionLoading ? (
                <Loading sx={{ px: 5 }} />
              ) : (
                'Download (data)'
              )}
            </Button>
            <ErrorOrTrack
              mt={2}
              hasError={
                hasData && !hasDraft && !isDepositionLoading && !deposition
              }
              preview={preview}
              pk={preprint.pk}
              errorMessage={
                dataUrl
                  ? 'Data could not be fetched. Update submission type or fix data before publishing.'
                  : 'Data missing in supplementary files. Update submission type or add data before publishing.'
              }
            />
            <ErrorOrTrack
              mt={2}
              hasError={
                hasData && !!hasDraft && !isDepositionLoading && !deposition
              }
              preview={preview}
              pk={preprint.pk}
              errorMessage={
                "Data stored under 'CDRXIV_DATA_DRAFT' in supplementary files, but must be moved to 'CDRXIV_DATA_PUBLISHED'."
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

        <VersionHistory
          preprint={preprint}
          deposition={deposition}
          preview={preview}
        />
      </Flex>

      {externalData && (
        <Box>
          <Field label='External data'>
            <Link href={externalData.url} sx={{ variant: 'text.mono' }}>
              {externalData.label}
            </Link>
          </Field>
          <ErrorOrTrack
            mt={2}
            hasError={hasData}
            preview={preview}
            pk={preprint.pk}
            errorMessage={'External data present on a data submission.'}
          />
        </Box>
      )}

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
          {articleLicenseInfo?.url ? (
            <Link href={articleLicenseInfo.url} sx={{ variant: 'text.mono' }}>
              {articleLicenseInfo.name}
            </Link>
          ) : (
            articleLicenseInfo?.name
          )}
          {submissionType === 'Both' ? '(Article)' : null}
        </Flex>
        <ErrorOrTrack
          mt={2}
          hasError={!articleLicenseInfo}
          preview={preview}
          pk={preprint.pk}
          errorMessage={
            preprint.license
              ? `No license information found for pk=${preprint.license.pk}.`
              : 'No license provided.'
          }
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

      {preprint.date_published &&
        (preprint.versions.length === 1 ? (
          <Field label='Published'>
            <Flex
              sx={{
                columnGap: 2,
                rowGap: 0,
                variant: 'text.mono',
                flexWrap: 'wrap',
              }}
            >
              {formatDate(new Date(preprint.date_published))}
            </Flex>
          </Field>
        ) : (
          <Field label='Dates'>
            {preprint.versions.map((version) => (
              <Flex
                key={version.version}
                sx={{
                  columnGap: 2,
                  rowGap: 0,
                  variant: 'text.mono',
                  flexWrap: 'wrap',
                }}
              >
                <Box>{formatDate(new Date(version.date_time))}</Box>
                {(version.title || preprint.title).startsWith('WITHDRAWN')
                  ? '(Withdrawn)'
                  : `(v${version.version})`}
              </Flex>
            ))}
          </Field>
        ))}
    </Flex>
  )
}

export default PreprintMetadata
