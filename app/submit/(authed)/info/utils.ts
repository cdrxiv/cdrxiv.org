import { createAdditionalField } from '../utils'
import { Preprint } from '../../../../types/preprint'
import { getAdditionalField } from '../../../../utils/data'
import { updatePreprint } from '../actions'

export type FormData = {
  title: string
  abstract: string
  license: number
  doi: string
  subject: string[]
  keywords: string[]
  funding: string
}

export const initializeForm = (preprint: Preprint): FormData => {
  return {
    title: preprint.title === 'Placeholder' ? '' : preprint.title,
    abstract: preprint.abstract ?? '',
    license:
      typeof preprint.license === 'number'
        ? preprint.license
        : preprint.license?.pk,
    doi: preprint.doi ?? '',
    subject: preprint.subject.map(({ name }) => name),
    keywords: preprint.keywords.map(({ word }) => word),
    funding:
      getAdditionalField(preprint, 'Funder(s) and award numbers') ?? '[]',
  }
}

export const validateForm = ({
  title,
  abstract,
  license,
  doi,
  subject,
  keywords,
  funding,
}: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!title || title === 'Placeholder') {
    result.title = 'You must provide title for your submission.'
  }

  if (!abstract) {
    result.abstract = 'You must provide abstract for your submission.'
  }

  if (!license) {
    result.license = 'You must provide license for your submission.'
  }

  if (doi && !doi.startsWith('https://doi.org/')) {
    result.doi = 'Provided DOI invalid.'
  }

  if (subject.length === 0) {
    result.subject = 'Please select at least one subject.'
  }

  return result
}

export const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  { title, abstract, license, doi, subject, keywords, funding }: FormData,
) => {
  const params = {
    title,
    abstract,
    license,
    doi: doi ? doi : null,
    subject: subject.map((name) => ({ name })),
    keywords: keywords.map((word) => ({ word })),
    additional_field_answers: [
      ...preprint.additional_field_answers,
      createAdditionalField('Funder(s) and award numbers', funding),
    ],
  }

  return updatePreprint(preprint, params).then((updated) =>
    setPreprint(updated),
  )
}
