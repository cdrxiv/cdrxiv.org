import React from 'react'
import { Box } from 'theme-ui'
import StyledButton from '../../../components/button'
import StyledLink from '../../../components/link'
import { formatDate } from '../../../utils/formatters'
import type { Funder, Preprint } from '../../../types/preprint'
import { getAdditionalField } from '../../../utils/data'

interface MetadataItemProps {
  title: string
  children: React.ReactNode
}

const MetadataItem: React.FC<MetadataItemProps> = ({ title, children }) => (
  <Box sx={{ mb: 5 }}>
    <Box sx={{ variant: 'text.monoCaps', mb: 2 }}>{title}</Box>
    {children}
  </Box>
)

const MetadataView: React.FC<{ preprint: Preprint }> = ({ preprint }) => {
  return (
    <Box sx={{ mt: 5 }}>
      {preprint.subject.length > 0 && (
        <MetadataItem title='Pathways'>
          {preprint.subject.map(({ name }) => (
            <StyledLink
              key={name}
              href={`/?subject=${name}`}
              forwardArrow
              sx={{
                variant: 'text.mono',
                mb: 1,
                display: 'block',
              }}
            >
              {name}
            </StyledLink>
          ))}
        </MetadataItem>
      )}

      <Box sx={{ mb: 5 }}>
        <StyledButton href={preprint.versions[0].public_download_url}>
          Download (PDF)
        </StyledButton>
      </Box>

      {preprint.versions.length > 1 && (
        <MetadataItem title='Older Versions'>
          {preprint.versions.slice(1).map((version) => (
            <StyledLink
              key={version.version}
              href={version.public_download_url}
              forwardArrow
              sx={{ variant: 'text.mono', mb: 1, display: 'block' }}
            >
              {formatDate(new Date(version.date_time))}, v{version.version}
            </StyledLink>
          ))}
        </MetadataItem>
      )}

      <MetadataItem title='Funders'>
        {JSON.parse(
          getAdditionalField(preprint, 'Funder(s) and award numbers') || '[]',
        ).map((item: Funder) => (
          <Box
            key={`${item.funder}-${item.award}`}
            sx={{ variant: 'text.mono', mb: 1 }}
          >
            {item.funder}: {item.award}
          </Box>
        ))}
      </MetadataItem>

      <MetadataItem title='License'>
        <StyledLink href={preprint.license.url} sx={{ variant: 'text.mono' }}>
          {preprint.license.short_name}
        </StyledLink>
      </MetadataItem>

      {preprint.keywords.length > 0 && (
        <MetadataItem title='Keywords'>
          <Box sx={{ variant: 'text.mono', mb: 1 }}>
            {preprint.keywords.map(({ word }, index, array) => (
              <React.Fragment key={word}>
                <StyledLink
                  href={`/?keyword=${word}`}
                  sx={{ display: 'inline', variant: 'text.mono' }}
                >
                  {word}
                </StyledLink>
                {index < array.length - 1 && ', '}
              </React.Fragment>
            ))}
          </Box>
        </MetadataItem>
      )}
    </Box>
  )
}

export default MetadataView
