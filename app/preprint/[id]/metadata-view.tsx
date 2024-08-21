import React from 'react'
import { Box, Flex } from 'theme-ui'
import { formatDate } from '../../../utils/formatters'
import type { Preprint, Funder } from '../../../types/preprint'
import { getAdditionalField, getFunders } from '../../../utils/data'
import { Field, Button, Link } from '../../../components'

const MetadataView: React.FC<{ preprint: Preprint }> = ({ preprint }) => {
  const funders = getFunders(preprint) ?? []

  const submissionType = getAdditionalField(preprint, 'Submission type')
  const hasArticle = ['Article', 'Both'].includes(submissionType)
  const fileType = hasArticle ? 'PDF' : 'Data'

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
        {preprint.versions[0]?.public_download_url && (
          <Box sx={{}}>
            <Button href={preprint.versions[0].public_download_url}>
              Download ({fileType})
            </Button>
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
    </Flex>
  )
}

export default MetadataView
