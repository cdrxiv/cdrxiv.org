import { Preprint } from '../../../../types/preprint'
import {
  createAdditionalField,
  getAdditionalField,
} from '../../../../utils/data'
import { updatePreprint } from '../../../../actions'
import { SUGGESTED_KEYWORD_MAPPING } from '../../constants'

export type FormData = {
  title: string
  abstract: string
  license: number
  data_license: string
  subject: string[]
  keywords: string[]
  funding: string
  conflict_of_interest: string
  comments_editor: string
  submission_type: string
}

export const initializeForm = (preprint: Preprint): FormData => {
  const submissionType = getAdditionalField(preprint, 'Submission type') ?? ''
  return {
    title: preprint.title === 'Placeholder' ? '' : (preprint.title ?? ''),
    abstract: preprint.abstract ?? '',
    license:
      typeof preprint.license === 'number'
        ? preprint.license
        : (preprint.license?.pk ?? 0),
    data_license:
      submissionType === 'Article'
        ? ''
        : (getAdditionalField(preprint, 'Data license') ?? ''),
    subject: preprint.subject.map(({ name }) => name),
    keywords: preprint.keywords.map(({ word }) => word),
    funding:
      getAdditionalField(preprint, 'Funder(s) and award numbers') ?? '[]',
    conflict_of_interest:
      getAdditionalField(preprint, 'Conflict of interest statement') ?? '',
    comments_editor: '',
    submission_type: submissionType, // not editable; stored in form state for convenience
  }
}

export const validateForm = ({
  title,
  abstract,
  license,
  data_license,
  subject,
  keywords,
  conflict_of_interest,
  submission_type,
}: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!title || title === 'Placeholder') {
    result.title = 'You must provide title for your submission.'
  }

  if (!abstract) {
    result.abstract = 'You must provide abstract for your submission.'
  }

  if (!license) {
    result.license =
      submission_type === 'Article'
        ? 'You must provide license for your submission.'
        : 'You must provide license for your article.'
  }

  if (['Both', 'Data'].includes(submission_type) && !data_license) {
    result.data_license = 'You must provide license for your data submission.'
  }

  if (subject.length === 0) {
    result.subject = 'Please select at least one subject.'
  }

  if (keywords.length > 10) {
    result.keywords = 'Please provide no more than ten keywords.'
  }

  if (conflict_of_interest === '') {
    result.conflict_of_interest =
      'You must provide a response or check the no-conflicts box.'
  }

  return result
}

export const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  {
    title,
    abstract,
    license,
    subject,
    keywords,
    funding,
    conflict_of_interest,
    comments_editor,
    data_license,
    submission_type,
  }: FormData,
) => {
  const additional_field_answers = [
    ...preprint.additional_field_answers.filter(
      (el) =>
        el.field?.name &&
        ![
          'Funder(s) and award numbers',
          'Conflict of interest statement',
          'Data license',
        ].includes(el.field.name),
    ),
    createAdditionalField('Funder(s) and award numbers', funding),
    createAdditionalField(
      'Conflict of interest statement',
      conflict_of_interest,
    ),
  ]

  if (submission_type !== 'Article') {
    additional_field_answers.push(
      createAdditionalField('Data license', data_license),
    )
  }
  const params = {
    title,
    abstract,
    license,
    subject: subject.map((name) => ({ name })),
    keywords: keywords.map((word) => ({ word })),
    additional_field_answers,
    ...(comments_editor ? { comments_editor } : {}),
  }

  return updatePreprint(preprint, params).then((updated) =>
    setPreprint(updated),
  )
}

export const getSuggestedKeywords = (subject: string[], keywords: string[]) => {
  let result = new Set<string>()

  subject.forEach((s) => {
    if (s in SUGGESTED_KEYWORD_MAPPING) {
      result = result.union(
        new Set(
          SUGGESTED_KEYWORD_MAPPING[
            s as keyof typeof SUGGESTED_KEYWORD_MAPPING
          ],
        ),
      )
    }
  })

  result = result.difference(new Set(keywords))

  return Array.from(result)
}
