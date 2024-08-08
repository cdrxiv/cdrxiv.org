'use client'

import { Flex, Input, Textarea } from 'theme-ui'
import Field from '../../../../components/field'
import Select from '../../../../components/select'
import KeywordInput from '../../../../components/keyword-input'
import FundingSources from '../../../../components/funding-sources'
import NavButtons from '../../nav-buttons'
import { usePreprint } from '../preprint-context'
import { createAdditionalField, getAdditionalField, useForm } from '../utils'
import { Preprint } from '../../../../types/preprint'
import { updatePreprint } from '../actions'

type FormData = {
  title: string
  abstract: string
  license: number
  doi: string
  subject: string[]
  keywords: string[]
  funding: string
}
const initializeForm = (preprint: Preprint) => {
  return {
    title: preprint.title === 'Placeholder' ? '' : preprint.title,
    abstract: preprint.abstract ?? '',
    license: preprint.license?.pk,
    doi: preprint.doi ?? '',
    subject: preprint.subject.map(({ name }) => name),
    keywords: preprint.keywords.map(({ word }) => word),
    funding:
      getAdditionalField(preprint, 'Funder(s) and award numbers') ?? '[]',
  }
}

const validateForm = ({
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

const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  { title, abstract, license, doi, subject, keywords, funding }: FormData,
) => {
  const params = {
    title,
    abstract,
    license: { pk: license as number },
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

const SubmissionInformation = () => {
  const { preprint, setPreprint } = usePreprint()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint),
    validateForm,
    submitForm.bind(null, preprint, setPreprint),
  )

  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
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
        <Field label='License' id='license' error={errors.license}>
          <Select
            value={data.license}
            onChange={(e) => setters.license(Number(e.target.value))}
            id='license'
          >
            <option value={0}>Select one</option>
            <option value={1}>CC BY 4.0</option>
          </Select>
        </Field>
        <Field
          label='DOI'
          id='doi'
          description="You can add a DOI linking to this item's published version using this field. Please provide the full DOI, e.g., https://doi.org/10.1017/CBO9781316161012."
          error={errors.doi}
        >
          <Input
            value={data.doi}
            onChange={(e) => setters.doi(e.target.value)}
            id='doi'
          />
        </Field>
        <Field label='Subject' id='subject' error={errors.subject}>
          <Select
            onChange={(e) =>
              setters.subject(e.target.value ? [e.target.value] : [])
            }
            id='subject'
          >
            <option value=''>Select one</option>
            <option value='Alkaline waste mineralization'>
              Alkaline waste mineralization
            </option>
          </Select>
        </Field>
        <Field
          label='Keywords'
          id='keywords'
          description='Hit Enter to add a new keyword.'
          error={errors.keywords}
        >
          <KeywordInput
            id='keywords'
            values={data.keywords}
            setValues={setters.keywords}
          />
        </Field>

        <Field label='Funding sources' id='funding' error={errors.funding}>
          <FundingSources value={data.funding} setValue={setters.funding} />
        </Field>
      </Flex>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionInformation
