import { Box } from 'theme-ui'
import StyledButton from '../../../components/button'
import StyledLink from '../../../components/link'
import { formatDate } from '../../../utils/formatters'
import type { Preprint } from '../../../types/preprint'

const MetadataView = ({ preprint }: { preprint: Preprint }) => {
  return (
    <>
      {preprint.subject.length > 0 && (
        <>
          <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 2 }}>Pathways</Box>
          {preprint.subject.map(({ name }) => (
            <StyledLink
              key={name}
              href={`/?subject=${name}`}
              forwardArrow
              sx={{
                variant: 'text.mono',
                mb: 1,
              }}
            >
              {name}
            </StyledLink>
          ))}
        </>
      )}

      <Box sx={{ mt: 6 }}>
        <StyledButton href={preprint.versions[0].public_download_url}>
          Download (PDF)
        </StyledButton>
      </Box>

      {preprint.versions.length > 1 && (
        <>
          <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 2 }}>
            Older Versions
          </Box>
          {preprint.versions.slice(1).map((version) => (
            <StyledLink
              key={version.version}
              href={version.public_download_url}
              forwardArrow
              sx={{ variant: 'text.mono', mb: 1 }}
            >
              {formatDate(new Date(version.date_time))}, v{version.version}
            </StyledLink>
          ))}
        </>
      )}

      {/* TODO: funders are coming in with a mix of formats */}
      {preprint.additional_field_answers.find(
        (answer) =>
          answer?.field?.name === 'Funder(s) and award numbers' &&
          answer.answer !== '',
      ) && (
        <>
          <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 2 }}>Funders</Box>
          {preprint.additional_field_answers
            .filter(
              (answer) => answer?.field?.name === 'Funder(s) and award numbers',
            )
            .map((answer) => (
              <Box key={answer.answer} sx={{ variant: 'text.mono', mb: 1 }}>
                {answer.answer}
              </Box>
            ))}
        </>
      )}

      <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 2 }}>License</Box>
      <StyledLink href={preprint.license.url} sx={{ variant: 'text.mono' }}>
        {preprint.license.short_name}
      </StyledLink>

      {preprint.keywords.length > 0 && (
        <>
          <Box sx={{ variant: 'text.monoCaps', mt: 5, mb: 2 }}>Keywords</Box>
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
        </>
      )}
    </>
  )
}
export default MetadataView
