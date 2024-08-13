import { Preprint } from '../../../../types/preprint'
import { createAdditionalField, getAdditionalField, useForm } from '../utils'
import { updatePreprint } from '../actions'

export type FormData = {
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

export const submitForm = (
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
