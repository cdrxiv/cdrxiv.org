import React from 'react'
import { Box, Flex } from 'theme-ui'
import { formatDate } from '../utils/formatters'
import { getAdditionalField, getFunders } from '../utils/data'
import { Field, Button, Link } from '../components'
import type { Preprint, Funder } from '../types/preprint'
import type { Deposition } from '../types/zenodo'

const getDataDownload = (deposition: Deposition) => {
  return `${process.env.NEXT_PUBLIC_ZENODO_URL}/records/${deposition.id}/files/${deposition.files[0].filename}?download=1`
}

const PreprintMetadata: React.FC<{
  preprint: Preprint
  deposition?: Deposition
  preview?: boolean
  previewUrl?: string
}> = ({ preprint, deposition, preview, previewUrl }) => {
  const funders = getFunders(preprint) ?? []

  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType ?? '')
  const hasData = ['Data', 'Both'].includes(submissionType ?? '')
  const conflictOfInterest = getAdditionalField(
    preprint,
    'Conflict of interest statement',
  )
  const hasConflictOfInterest =
    conflictOfInterest && conflictOfInterest !== 'None'

  return (
    <Flex sx={{ flexDirection: 'column', mt: 5, gap: 9 }}>
      {preprint.subject.length > 0 && (
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
        </Field>
      )}

      <Flex sx={{ flexDirection: 'column', gap: 5 }}>
        {preview && hasData && !deposition && (
          <Box sx={{ variant: 'text.mono', color: 'red', mt: 2 }}>
            No data deposition found. Update submission type or add data before
            publishing.
          </Box>
        )}

        {preview &&
          hasArticle &&
          !preprint.versions[0]?.public_download_url && (
            <Box sx={{ variant: 'text.mono', color: 'red', mt: 2 }}>
              No article PDF found. Update submission type or add PDF before
              publishing.
            </Box>
          )}

        {hasArticle && preprint.versions[0]?.public_download_url && (
          <Button
            href={
              preview ? previewUrl : preprint.versions[0].public_download_url
            }
          >
            Download (PDF)
          </Button>
        )}
        {hasData && deposition && (
          <Box>
            {deposition.submitted || preview ? (
              <Button href={getDataDownload(deposition)}>
                Download (data)
              </Button>
            ) : null}
            {!deposition.submitted && preview && (
              <Box sx={{ variant: 'text.mono', color: 'red', mt: 2 }}>
                Data not published!
              </Box>
            )}
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
        <Link href={preprint.license.url} sx={{ variant: 'text.mono' }}>
          {preprint.license.short_name}
        </Link>
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
