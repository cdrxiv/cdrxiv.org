'use client'

import { Box, Flex, Input, Textarea } from 'theme-ui'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import {
  VersionQueue,
  UpdateType,
  ReviewPreprint,
  PublishedPreprint,
  PreprintFile,
} from '../../../../../types/preprint'
import VersionsList from './versions-list'
import SharedLayout from '../../../shared-layout'
import {
  Button,
  Field,
  FileInput,
  FileInputValue,
  Form,
  Link,
  Select,
} from '../../../../../components'
import { formatDate } from '../../../../../utils/formatters'
import { useForm } from '../../../../../hooks/use-form'
import { UPDATE_TYPE_DESCRIPTIONS, UPDATE_TYPE_LABELS } from './constants'
import { getAdditionalField } from '../../../../../utils/data'
import { createVersionQueue, updatePreprint } from '../../../../../actions'
import { useLoading } from '../../../../../components/layouts/paneled-page'
import {
  handleArticleUpload,
  handleDataUpload,
  initializeUploadProgress,
} from '../../../../utils/upload-handlers'

type Props = {
  preprint: ReviewPreprint | PublishedPreprint
  versions: VersionQueue[]
}

type UploadProgress = {
  article?: number
  data?: number
}

type FormData = {
  preprint: number
  update_type: UpdateType
  submissionType: string
  title: string
  abstract: string
  published_doi: string
  articleFile: FileInputValue | null
  dataFile: FileInputValue | null
}
const initializeForm = (preprint: Props['preprint']): FormData => {
  return {
    preprint: preprint.pk,
    update_type: 'version' as UpdateType,
    title: preprint.title,
    abstract: preprint.abstract,
    published_doi: preprint.doi ?? '',
    articleFile: null,
    dataFile: null,
    submissionType: getAdditionalField(preprint, 'Submission type') ?? '', // not editable; stored in form state for convenience
  }
}

const validateForm = (
  preprint: Props['preprint'],
  {
    update_type,
    title,
    abstract,
    published_doi,
    articleFile,
    dataFile,
    submissionType,
  }: FormData,
) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}
  if (!title || title === 'Placeholder') {
    result.title = 'You must provide title for your submission.'
  }

  if (!abstract) {
    result.abstract = 'You must provide abstract for your submission.'
  }

  if (published_doi && !published_doi.startsWith('https://doi.org/')) {
    result.published_doi = 'Provided DOI invalid.'
  }

  if (update_type === 'metadata_correction') {
    if (
      preprint.title === title &&
      preprint.abstract === abstract &&
      (preprint.doi ?? '') === published_doi
    ) {
      result.title =
        'Metadata corrections must include an update to the title, abstract, and/or DOI.'
    }
  }

  if (update_type === 'correction' && !articleFile) {
    result.articleFile = 'You must provide a new file for a text update.'
  }

  if (update_type === 'version' && !articleFile && !dataFile) {
    const errorMessage =
      submissionType === 'Both'
        ? 'You must upload a new file for at least one content type.'
        : 'You must upload a new file to create a new version.'
    result.articleFile = errorMessage
    result.dataFile = errorMessage
  }

  return result
}

const submitForm = async (
  preprint: Props['preprint'],
  setUploadProgress: (
    updater: (prev: UploadProgress) => UploadProgress,
  ) => void,
  {
    preprint: preprint_pk,
    update_type,
    title,
    abstract,
    published_doi,
    articleFile,
    dataFile,
    submissionType,
  }: FormData,
) => {
  initializeUploadProgress(articleFile, dataFile, setUploadProgress)

  let file = null
  if (
    submissionType !== 'Data' &&
    update_type !== 'metadata_correction' &&
    articleFile &&
    !articleFile.persisted
  ) {
    const preprintFile = await handleArticleUpload(
      articleFile,
      preprint.pk,
      setUploadProgress,
    )
    file = preprintFile?.pk
  }

  if (
    submissionType !== 'Article' &&
    update_type === 'version' &&
    dataFile &&
    !dataFile.persisted
  ) {
    const label =
      preprint.stage === 'preprint_published'
        ? 'CDRXIV_DATA_PUBLISHED'
        : 'CDRXIV_DATA_DRAFT'
    const existingFile = preprint.supplementary_files.find(
      (file) => file.label === label,
    )

    const supplementaryFiles = await handleDataUpload(
      dataFile,
      existingFile,
      setUploadProgress,
    )

    if (supplementaryFiles) {
      await updatePreprint(preprint, {
        supplementary_files: supplementaryFiles,
      })
    }
  }

  return createVersionQueue({
    preprint: preprint_pk,
    update_type,
    title,
    abstract,
    published_doi: published_doi || null,
    file,
  })
}

const EditFormContent: React.FC<Props> = ({ versions, preprint }) => {
  const router = useRouter()
  const { setIsLoading, setUploadProgress } = useLoading()
  const validator = useMemo(() => validateForm.bind(null, preprint), [preprint])
  const { data, setters, errors, onSubmit, submitError } = useForm(
    () => initializeForm(preprint),
    validator,
    submitForm.bind(null, preprint, setUploadProgress),
    { preprint: preprint.pk },
  )

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    const result = await onSubmit()
    if (result) {
      router.push('/submissions')
      // Loading toggle off handled in paneled-page
    } else {
      setIsLoading(false)
    }
  }, [onSubmit, router, setIsLoading])

  const collectArticleFile =
    data.submissionType !== 'Data' && data.update_type !== 'metadata_correction'
  const collectDataFile =
    data.submissionType !== 'Article' && data.update_type === 'version'

  return (
    <Form error={submitError}>
      <Field
        label='Type of revision'
        id='update_type'
        error={errors.update_type}
        description={
          <>
            {UPDATE_TYPE_DESCRIPTIONS[data.update_type]}
            <br />
            <br />
            If no option fits, consider starting a new submission or contact{' '}
            <Link
              href='mailto:support@cdrxiv.org'
              sx={{ variant: 'text.mono' }}
            >
              support@cdrxiv.org
            </Link>
            .
          </>
        }
      >
        <Select
          value={data.update_type}
          onChange={(e) => setters.update_type(e.target.value as UpdateType)}
          id='update_type'
        >
          {Object.keys(UPDATE_TYPE_LABELS).map((value) =>
            value === 'correction' && data.submissionType === 'Data' ? null : ( // Do not collect text corrections for data-only submissions
              <option key={value} value={value}>
                {UPDATE_TYPE_LABELS[value as UpdateType]}
              </option>
            ),
          )}
        </Select>
      </Field>
      <Field label='Title' id='title' error={errors.title}>
        <Input
          value={data.title}
          onChange={(e) => setters.title(e.target.value)}
          id='title'
        />
      </Field>
      <Field
        label='Abstract'
        id='abstract'
        description='This should be the same as the article abstract or, for data-only submissions, a brief description of the dataset.'
        error={errors.abstract}
      >
        <Textarea
          value={data.abstract}
          onChange={(e) => setters.abstract(e.target.value)}
          id='abstract'
        />
      </Field>
      <Field
        label='DOI'
        id='published_doi'
        description="You can add a DOI linking to this item's published version using this field. Please provide the full DOI, e.g., https://doi.org/10.1017/CBO9781316161012."
        error={errors.published_doi}
      >
        <Input
          value={data.published_doi}
          onChange={(e) => setters.published_doi(e.target.value)}
          id='published_doi'
        />
      </Field>
      {collectArticleFile && (
        <Field
          label='Article file'
          id='articleFile'
          description='Your article must be submitted as a PDF.'
          error={errors.articleFile}
        >
          <FileInput
            file={data.articleFile}
            onChange={setters.articleFile}
            accept='application/pdf'
          />
        </Field>
      )}
      {collectDataFile && (
        <Field
          label='Data file'
          id='dataFile'
          description='Your data submission must be a single file of any format, including ZIP, up to 10 GB.'
          error={errors.dataFile}
        >
          <FileInput file={data.dataFile} onChange={setters.dataFile} />
        </Field>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
    </Form>
  )
}

// Wrapper so that loading context is available
const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  return (
    <SharedLayout
      title={preprint.title}
      metadata={
        <Flex sx={{ flexDirection: 'column', gap: 8 }}>
          {preprint.date_published && (
            <Field label='Live version'>
              <Box as='ul' sx={{ variant: 'styles.ul' }}>
                <Box as='li' sx={{ variant: 'styles.li' }}>
                  <Link
                    href={`/preprint/${preprint.pk}`}
                    sx={{ variant: 'text.mono' }}
                  >
                    {formatDate(new Date(preprint.date_published))}
                  </Link>
                </Box>
              </Box>
            </Field>
          )}
          <Field label='Previous updates'>
            <VersionsList versions={versions} />
          </Field>
        </Flex>
      }
      back
    >
      <EditFormContent versions={versions} preprint={preprint} />
    </SharedLayout>
  )
}

export default EditForm
