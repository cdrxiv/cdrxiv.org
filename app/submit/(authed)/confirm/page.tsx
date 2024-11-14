'use client'

import { Box, Flex } from 'theme-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button, Field, Form, Link, Row } from '../../../../components'
import NavButtons from '../../nav-buttons'
import { PATHS } from '../../constants'
import { usePreprint, usePreprintFiles } from '../../preprint-context'
import { createAdditionalField, getFormattedDate } from '../utils'
import { updateDataDeposition, updatePreprint } from '../../../../actions'
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
import useTracking from '../../../../hooks/use-tracking'
import { useLoading } from '../../../../components/layouts/paneled-page'

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
          {PATHS[index].title}
          <Link href={PATHS[index].href} sx={{ variant: 'forms.label' }}>
            Edit
          </Link>
        </Flex>
      }
      id={PATHS[index].title}
    >
      {children}
    </Field>
  )
}

const SubmissionConfirmation = () => {
  const { preprint, setPreprint } = usePreprint()
  const { files } = usePreprintFiles()
  const router = useRouter()
  const track = useTracking()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { setIsLoading } = useLoading()

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
        preprint: preprint.pk,
      })
    info.error &&
      track('confirm_page_info_error', {
        error: info.error,
        preprint: preprint.pk,
      })
    authors.error &&
      track('confirm_page_authors_error', {
        error: authors.error,
        preprint: preprint.pk,
      })
  }, [overview.error, info.error, authors.error, preprint.pk, track])

  const submissionType = getSubmissionType({
    dataFile: overview.data.dataFile,
    articleFile: overview.data.articleFile,
  })

  const handleDataFileError = useCallback(() => {
    return updatePreprint(preprint, { supplementary_files: [] }).then(
      (updated) => setPreprint(updated),
    )
  }, [preprint, setPreprint])

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
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
          preprint: preprint.pk,
          user: preprint.owner,
          submission_type: submissionType,
        })
        router.push(`/submit/success?type=${submissionType}`)
      })
      .catch((err) => {
        track('preprint_submitted_error', {
          preprint: preprint.pk,
          error: err.message,
          submission_type: submissionType,
        })
        setSubmitError(
          err.message ??
            'Unable to complete submission. Please check submission contents and try again.',
        )
        setIsLoading(false)
      })
  }, [
    preprint,
    router,
    submissionType,
    overview.data.dataFile,
    setIsLoading,
    track,
  ])
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

                <DataFileDisplay
                  file={overview.data.dataFile}
                  onError={handleDataFileError}
                />
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
                <Link
                  key={subject}
                  href={`/?subject=${subject}`}
                  sx={{
                    variant: 'text.mono',
                    display: 'block',
                  }}
                >
                  {subject}
                </Link>
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
