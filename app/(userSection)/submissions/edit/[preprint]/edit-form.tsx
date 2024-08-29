'use client'

import { Box, Flex, Input, Textarea } from 'theme-ui'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import {
  Preprint,
  VersionQueue,
  UpdateType,
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
import {
  createPreprintFile,
  createVersionQueue,
  updatePreprint,
} from '../../../../../actions/preprint'
import {
  createDataDepositionFile,
  createDataDepositionVersion,
  fetchDataDeposition,
} from '../../../../../actions/zenodo'

type Props = {
  preprint: Preprint
  versions: VersionQueue[]
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
const initializeForm = (preprint: Preprint): FormData => {
  return {
    preprint: preprint.pk,
    update_type: 'metadata_correction' as UpdateType,
    title: preprint.title,
    abstract: preprint.abstract,
    published_doi: preprint.doi ?? '',
    articleFile: null,
    dataFile: null,
    submissionType: getAdditionalField(preprint, 'Submission type') ?? '', // not editable; stored in form state for convenience
  }
}

const validateForm = (
  preprint: Preprint,
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
  preprint: Preprint,
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
  let file = null
  if (
    submissionType !== 'Data' &&
    update_type !== 'metadata_correction' &&
    articleFile &&
    !articleFile.persisted
  ) {
    const formData = new FormData()

    formData.set('file', articleFile.file)
    formData.set('preprint', String(preprint))
    formData.set('mime_type', articleFile.mime_type)
    formData.set('original_filename', articleFile.original_filename)

    const preprintFile = await createPreprintFile(formData)
    file = preprintFile.pk
  }

  if (
    submissionType !== 'Article' &&
    update_type === 'version' &&
    dataFile &&
    !dataFile.persisted
  ) {
    const depositionUrl =
      preprint.supplementary_files.find(
        (file) => file.label === 'CDRXIV_DATA_PUBLISHED',
      )?.url ?? null

    if (!depositionUrl) {
      throw new Error('No published data uploads found.')
    }

    const existingDeposition = await fetchDataDeposition(depositionUrl)
    const newDeposition = await createDataDepositionVersion(
      existingDeposition.links.newversion,
    )
    const formData = new FormData()

    formData.set('name', dataFile.original_filename)
    formData.set('file', dataFile.file)

    createDataDepositionFile(newDeposition.id, formData)

    await updatePreprint(preprint, {
      supplementary_files: [
        { label: 'CDRXIV_DATA_DRAFT', url: newDeposition.links.self },
      ],
    })
  }

  // TODO: update metadata on Zenodo deposition metadata if changed

  return createVersionQueue({
    preprint: preprint_pk,
    update_type,
    title,
    abstract,
    published_doi: published_doi || null,
    file,
  })
}

const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  const router = useRouter()
  const validator = useMemo(() => validateForm.bind(null, preprint), [preprint])
  const { data, setters, errors, onSubmit, submitError } = useForm(
    () => initializeForm(preprint),
    validator,
    submitForm.bind(null, preprint),
  )

  const handleSubmit = useCallback(async () => {
    const result = await onSubmit()
    if (result) {
      router.push('/submissions')
    }
  }, [onSubmit, router])

  const collectArticleFile =
    data.submissionType !== 'Data' && data.update_type !== 'metadata_correction'
  const collectDataFile =
    data.submissionType !== 'Article' && data.update_type === 'version'

  return (
    <SharedLayout
      title={preprint.title}
      metadata={
        <Flex sx={{ flexDirection: 'column', gap: 8 }}>
          {preprint.date_published && (
            <Field label='Live version'>
              <Box as='ul' sx={{ variant: 'styles.ul' }}>
                <Box
                  as='li'
                  sx={{
                    variant: 'styles.li',
                  }}
                >
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
      <Form error={submitError}>
        <Field
          label='Type'
          id='update_type'
          error={errors.update_type}
          description={UPDATE_TYPE_DESCRIPTIONS[data.update_type]}
        >
          <Select
            value={data.update_type}
            onChange={(e) => setters.update_type(e.target.value as UpdateType)}
            id='update_type'
          >
            {Object.keys(UPDATE_TYPE_LABELS).map((value) =>
              value === 'correction' &&
              data.submissionType === 'Data' ? null : ( // Do not collect text corrections for data-only submissions
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
          description='Some info about abstract formatting'
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
            description='Your submission can by represented by a single file of any format, including ZIP, up to [TK] MB.'
            error={errors.dataFile}
          >
            <FileInput file={data.dataFile} onChange={setters.dataFile} />
          </Field>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </SharedLayout>
  )
}

export default EditForm
