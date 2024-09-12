'use client'

import { Box, Flex } from 'theme-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button, Field, Form, Link, Row } from '../../../../components'
import NavButtons from '../../nav-buttons'
import { PATHS } from '../../constants'
import { usePreprint, usePreprintFiles } from '../preprint-context'
import { createAdditionalField, getFormattedDate } from '../utils'
import { updateDataDeposition } from '../../../../actions/zenodo'
import { updatePreprint } from '../../../../actions/preprint'
import {
  initializeForm as initializeInfo,
  validateForm as validateInfo,
} from '../info'
import {
  initializeForm as initializeOverview,
  validateForm as validateOverview,
} from '../overview'
import AuthorsList from '../authors/authors-list'
import DataFileDisplay from '../overview/data-file-display'
import FileDisplay from '../overview/file-display'
import { getZenodoMetadata } from '../../../../utils/data'
import { getSubmissionType } from '../overview/utils'
import { track } from '../../../../utils/tracking'

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
          <Link href={PATHS[index].href} sx={{ variant: 'forms.label' }}>
            Edit
          </Link>
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
  const { files } = usePreprintFiles()
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { info, overview, authors } = useMemo(() => {
    const info = initializeInfo(preprint)
    const overview = initializeOverview(preprint, files)
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
  }, [preprint, files])

  useEffect(() => {
    overview.error &&
      track('confirm_page_overview_error', {
        error: overview.error,
        preprint_id: preprint.pk,
      })
    info.error &&
      track('confirm_page_info_error', {
        error: info.error,
        preprint_id: preprint.pk,
      })
    authors.error &&
      track('confirm_page_authors_error', {
        error: authors.error,
        preprint_id: preprint.pk,
      })
  }, [overview.error, info.error, authors.error, preprint.pk])

  const submissionType = getSubmissionType({
    dataFile: overview.data.dataFile,
    articleFile: overview.data.articleFile,
  })
  const handleSubmit = useCallback(() => {
    updatePreprint(preprint, {
      stage: 'preprint_review',
      date_submitted: getFormattedDate(),
      additional_field_answers: [
        ...preprint.additional_field_answers,
        // Ensure that submission type is up-to-date with files provided
        createAdditionalField('Submission type', submissionType),
      ],
    })
      .then(() => {
        if (overview.data.dataFile?.url) {
          // Push metadata to Zenodo
          return updateDataDeposition(overview.data.dataFile.url, {
            metadata: getZenodoMetadata(preprint),
          })
        }
      })
      .then(() => {
        track('preprint_submitted_success', {
          preprint_id: preprint.pk,
          owner: preprint.owner,
        })
        router.push('/submit/success')
      })
      .catch((err) => {
        track('preprint_submitted_error', {
          preprint_id: preprint.pk,
          error: err.message,
        })
        setSubmitError(
          err.message ??
            'Unable to complete submission. Please check submission contents and try again.',
        )
      })
  }, [preprint, router, submissionType, overview.data.dataFile])

  return (
    <div>
      <Form error={submitError}>
        <SectionWrapper index={0} error={overview.error}>
          <Row columns={[1, 2, 2, 2]} gap={[5, 6, 6, 8]}>
            {overview.data.articleFile && (
              <SummaryCard>
                <Box sx={{ variant: 'text.body' }}>Article</Box>

                <FileDisplay
                  name={overview.data.articleFile.original_filename}
                />
              </SummaryCard>
            )}
            {overview.data.dataFile && (
              <SummaryCard>
                <Box sx={{ variant: 'text.body' }}>Data</Box>

                <DataFileDisplay file={overview.data.dataFile} />
              </SummaryCard>
            )}
            {overview.data.externalFile && (
              <SummaryCard>
                <Box sx={{ variant: 'text.body' }}>External data</Box>

                <FileDisplay
                  href={overview.data.externalFile.url}
                  name={overview.data.externalFile.label}
                />
              </SummaryCard>
            )}
          </Row>
        </SectionWrapper>

        <SectionWrapper index={1} error={info.error}>
          <SummaryCard>
            <Box sx={{ variant: 'text.body' }}>
              {info.data.title || 'No title'}
            </Box>
            <Box>{info.data.abstract || 'No abstract'}</Box>
            <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
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

        <SectionWrapper index={2} error={authors.error}>
          <AuthorsList removable={false} />
        </SectionWrapper>

        <Button
          onClick={handleSubmit}
          disabled={!!(info.error || info.error || authors.error)}
        >
          Submit
        </Button>
      </Form>

      <NavButtons />
    </div>
  )
}

export default SubmissionConfirmation
