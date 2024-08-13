'use client'

import { Box, Flex } from 'theme-ui'

import Field from '../../../../components/field'
import NavButtons from '../../nav-buttons'
import AuthorsList from '../authors/authors-list'
import StyledButton from '../../../../components/button'
import { PATHS } from '../../constants'
import { usePreprint } from '../preprint-context'
import StyledLink from '../../../../components/link'

const SummaryCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        variant: 'text.mono',
        width: '100%',
        height: 'auto',
        p: [3, 6, 6, 7],
        borderColor: 'text',
        borderWidth: '1px',
        borderStyle: 'solid',
        outline: 'none', // use highlight style for focus instead
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>{children}</Flex>
    </Box>
  )
}

const SectionWrapper = ({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) => {
  return (
    <Field
      label={
        <Flex sx={{ gap: 2, alignItems: 'baseline' }}>
          {PATHS[index].label}
          <StyledLink href={PATHS[index].href} sx={{ variant: 'forms.label' }}>
            Edit
          </StyledLink>
        </Flex>
      }
      id={PATHS[index].label}
    >
      {children}
    </Field>
  )
}

const SubmissionConfirmation = () => {
  const { preprint } = usePreprint()

  return (
    <div>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        <SectionWrapper index={1}>TK</SectionWrapper>

        <SectionWrapper index={2}>
          <SummaryCard>
            <Box sx={{ variant: 'text.body' }}>{preprint.title}</Box>
            <Box>{preprint.abstract}</Box>
            <Flex sx={{ gap: 2 }}>
              {preprint.subject.map(({ name }) => (
                <Box
                  key={name}
                  sx={{
                    variant: 'styles.a',
                    fontFamily: 'mono',
                    fontWeight: 'mono',
                    fontSize: [0, 0, 0, 1],
                  }}
                >
                  {name}
                </Box>
              ))}
            </Flex>
          </SummaryCard>
        </SectionWrapper>

        <SectionWrapper index={3}>
          <AuthorsList removable={false} />
        </SectionWrapper>

        <StyledButton>Submit</StyledButton>
      </Flex>

      <NavButtons />
    </div>
  )
}

export default SubmissionConfirmation
