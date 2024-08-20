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
import { Button, Field, Form, Link, Select } from '../../../../../components'
import { formatDate } from '../../../../../utils/formatters'
import { useForm } from '../../../../../hooks/use-form'
import { UPDATE_TYPE_DESCRIPTIONS, UPDATE_TYPE_LABELS } from './constants'
import { createVersionQueue } from './actions'

type Props = {
  preprint: Preprint
  versions: VersionQueue[]
}

type FormData = {
  preprint: number
  update_type: UpdateType
  title: string
  abstract: string
  published_doi: string
  file: string
}
const initializeForm = (preprint: Preprint) => {
  return {
    preprint: preprint.pk,
    update_type: 'correction' as UpdateType,
    title: preprint.title,
    abstract: preprint.abstract,
    published_doi: preprint.doi ?? '',
    file: '',
  }
}

const validateForm = (
  preprint: Preprint,
  { update_type, title, abstract, published_doi, file }: FormData,
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

  if (update_type !== 'metadata_correction' && !file) {
    result.file = 'You must provide a new file for your update.'
  }

  return result
}

const submitForm = async ({
  preprint,
  update_type,
  title,
  abstract,
  published_doi,
  file,
}: FormData) => {
  return createVersionQueue({
    preprint,
    update_type,
    title,
    abstract,
    published_doi: published_doi || null,
  })
}

const EditForm: React.FC<Props> = ({ versions, preprint }) => {
  const router = useRouter()
  const validator = useMemo(() => validateForm.bind(null, preprint), [preprint])
  const { data, setters, errors, onSubmit, submitError } = useForm(
    () => initializeForm(preprint),
    validator,
    submitForm,
  )

  const handleSubmit = useCallback(async () => {
    const result = await onSubmit()
    if (result) {
      router.push('/submissions')
    }
  }, [onSubmit, router])

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
            {Object.keys(UPDATE_TYPE_LABELS).map((value) => (
              <option key={value} value={value}>
                {UPDATE_TYPE_LABELS[value as UpdateType]}
              </option>
            ))}
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
        {data.update_type !== 'metadata_correction' && (
          <Field label='File' id='file' error={errors.file}>
            <Input
              value={data.file}
              onChange={(e) => setters.file(e.target.value)}
              id='file'
            />
          </Field>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </SharedLayout>
  )
}

export default EditForm
