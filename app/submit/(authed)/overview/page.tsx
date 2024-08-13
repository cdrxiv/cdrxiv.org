'use client'

import { Box, Flex, Label } from 'theme-ui'

import Checkbox from '../../../../components/checkbox'
import Field from '../../../../components/field'
import NavButtons from '../../nav-buttons'
import { Preprint } from '../../../../types/preprint'
import { usePreprint } from '../preprint-context'
import { createAdditionalField, getAdditionalField, useForm } from '../utils'
import { updatePreprint } from '../actions'

type FormData = {
  agreement: boolean
  data: boolean
  article: boolean
}
export const initializeForm = (preprint: Preprint): FormData => {
  const submissionType = getAdditionalField(preprint, 'Submission type') ?? ''
  return {
    agreement: false,
    data: ['Data', 'Both'].includes(submissionType),
    article: ['Article', 'Both'].includes(submissionType),
  }
}

export const validateForm = ({ agreement, data, article }: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!agreement) {
    result.agreement = 'You must accept the user agreement to continue.'
  }

  if (!data && !article) {
    result.data = 'You must include at least one content type.'
    result.article = 'You must include at least one content type.'
  }

  return result
}

const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  { data, article }: FormData,
) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  let submissionType
  if (data && article) {
    submissionType = 'Both'
  } else if (data) {
    submissionType = 'Data'
  } else {
    submissionType = 'Article'
  }
  const params = {
    additional_field_answers: [
      createAdditionalField('Submission type', submissionType),
    ],
  }

  return updatePreprint(preprint, params).then((updated) =>
    setPreprint(updated),
  )
}

const SubmissionOverview = () => {
  const { preprint, setPreprint } = usePreprint()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint),
    validateForm,
    submitForm.bind(null, preprint, setPreprint),
  )

  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        {submitError && <Box sx={{ color: 'red' }}>{submitError}</Box>}
        <Field
          label='Submission agreement'
          id='agreement'
          error={errors.agreement}
        >
          <Label>
            <Checkbox
              id='agreement'
              checked={data.agreement}
              onChange={(e) => setters.agreement(e.target.checked)}
            />
            Authors grant us the right to publish, on this website, their
            uploaded manuscript, supplementary materials and any supplied
            metadata.
          </Label>
        </Field>

        <Field
          label='Submission contents'
          id='contents'
          description='Select the content types you’d like to include in your submission.'
          error={errors.article ?? errors.data}
        >
          <Flex sx={{ gap: 8 }}>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox
                value='article'
                checked={data.article}
                onChange={(e) => setters.article(e.target.checked)}
              />
              Article
            </Label>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox
                value='data'
                checked={data.data}
                onChange={(e) => setters.data(e.target.checked)}
              />
              Data
            </Label>
          </Flex>
        </Field>
      </Flex>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionOverview
