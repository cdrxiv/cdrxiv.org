import React from 'react'
import { Box, Flex } from 'theme-ui'
import { formatDate } from '../../../utils/formatters'
import type { Funder, Preprint } from '../../../types/preprint'
import { getFunders } from '../../../utils/data'
import { Field, Button, Link } from '../../../components'

const MetadataView: React.FC<{ preprint: Preprint }> = ({ preprint }) => {
  const funders = getFunders(preprint)
  return (
    <Flex sx={{ flexDirection: 'column', mt: 5, gap: 5 }}>
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

      <Box sx={{}}>
        <Button href={preprint.versions[0].public_download_url}>
          Download (PDF)
        </Button>
      </Box>

      {preprint.versions.length > 1 && (
        <Field label='Older Versions'>
          <Box
            as='ul'
            sx={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              variant: 'text.mono',
              color: 'blue',
            }}
          >
            {preprint.versions.slice(1).map((version) => (
              <Box as='li' key={version.version} sx={{ mb: 2 }}>
                <Box as='span' sx={{ marginRight: 2 }}>
                  {'>'}
                </Box>
                <Link
                  href={version.public_download_url}
                  sx={{
                    variant: 'text.mono',
                  }}
                >
                  {formatDate(new Date(version.date_time))}, v{version.version}
                </Link>
              </Box>
            ))}
          </Box>
        </Field>
      )}

      <Field label='Funders'>
        {funders.map((item: Funder) => (
          <Box
            key={`${item.funder}-${item.award}`}
            sx={{ variant: 'text.mono' }}
          >
            {item.funder}: {item.award}
          </Box>
        ))}
        {funders.length === 0 && <Box sx={{ variant: 'text.mono' }}></Box>}
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
                  href={`/?keyword=${word}`}
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
