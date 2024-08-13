'use client'

import { Box, Flex } from 'theme-ui'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import Field from '../../../../components/field'
import NavButtons from '../../nav-buttons'
import StyledButton from '../../../../components/button'
import { PATHS } from '../../constants'
import { usePreprint } from '../preprint-context'
import StyledLink from '../../../../components/link'
import { getFormattedDate } from '../utils'
import { updatePreprint } from '../actions'
import {
  initializeForm as initializeInfo,
  validateForm as validateInfo,
} from '../info/page'
import {
  initializeForm as initializeOverview,
  validateForm as validateOverview,
} from '../overview/page'
import AuthorsList from '../authors/authors-list'

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
  error,
}: {
  children: React.ReactNode
  index: number
  error?: React.ReactNode
}) => {
  return (
    <Field
      error={error}
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
  const router = useRouter()

  const handleSubmit = useCallback(() => {
    updatePreprint(preprint, {
      stage: 'preprint_review',
      date_submitted: getFormattedDate(),
    }).then(() => {
      router.replace('/submit/success')
    })
  }, [preprint])

  const { info, overview, authors } = useMemo(() => {
    const info = initializeInfo(preprint)
    const overview = initializeOverview(preprint)
    const { agreement, ...overviewErrors } = validateOverview(overview)

    return {
      overview: { data: overview, error: Object.values(overviewErrors)[0] },
      info: { data: info, error: Object.values(validateInfo(info))[0] },
      authors: {
        data: null,
        error:
          preprint.authors.length < 1
            ? 'You must include at least one author.'
            : null,
      },
    }
  }, [preprint])

  return (
    <div>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        <SectionWrapper index={1} error={overview.error}>
          {overview.data.article && 'Article TK'}
          {overview.data.data && 'Data TK'}
        </SectionWrapper>

        <SectionWrapper index={2} error={info.error}>
          <SummaryCard>
            <Box sx={{ variant: 'text.body' }}>
              {info.data.title || 'No title'}
            </Box>
            <Box>{info.data.abstract || 'No abstract'}</Box>
            <Flex sx={{ gap: 2 }}>
              {info.data.subject.map((subject) => (
                <Box
                  key={subject}
                  sx={{
                    variant: 'styles.a',
                    fontFamily: 'mono',
                    fontWeight: 'mono',
                    fontSize: [0, 0, 0, 1],
                  }}
                >
                  {subject}
                </Box>
              ))}
            </Flex>
          </SummaryCard>
        </SectionWrapper>

        <SectionWrapper index={3} error={authors.error}>
          <AuthorsList removable={false} />
        </SectionWrapper>

        <StyledButton
          onClick={handleSubmit}
          disabled={!!(info.error || info.error || authors.error)}
        >
          Submit
        </StyledButton>
      </Flex>

      <NavButtons />
    </div>
  )
}

export default SubmissionConfirmation
