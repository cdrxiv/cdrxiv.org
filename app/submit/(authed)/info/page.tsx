'use client'

import { Input, Textarea } from 'theme-ui'
import { Field, Form, KeywordInput, Select } from '../../../../components'
import FundingSources from './funding-sources'
import NavButtons from '../../nav-buttons'
import { usePreprint } from '../preprint-context'
import { useForm } from '../utils'
import { useSubjects } from '../../../subjects-context'
import { FormData, initializeForm, validateForm, submitForm } from './utils'

const SubmissionInformation = () => {
  const { preprint, setPreprint } = usePreprint()
  const subjects = useSubjects()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint),
    validateForm,
    submitForm.bind(null, preprint, setPreprint),
  )

  return (
    <>
      <Form error={submitError}>
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
            value={String(data.license)}
            onChange={(e) => setters.license(Number(e.target.value))}
            id='license'
          >
            <option value={'0'}>Select one</option>
            <option value={'1'}>CC BY 4.0</option>
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
            value={data.subject}
            onChange={(e) =>
              setters.subject(
                subjects
                  .filter((el, i) => e.target.options[i].selected)
                  .map((el) => el.name),
              )
            }
            id='subject'
            multiple
            size={3}
          >
            {subjects.map(({ name }) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
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
      </Form>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionInformation
