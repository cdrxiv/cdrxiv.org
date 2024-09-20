'use client'

import { useState } from 'react'
import { Input, Label, Textarea } from 'theme-ui'
import {
  Checkbox,
  Field,
  Form,
  KeywordInput,
  Select,
} from '../../../../components'
import FundingSources from './funding-sources'
import NavButtons from '../../nav-buttons'
import Licenses from './licenses'
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

  const [hasConflict, setHasConflict] = useState(
    data.conflict_of_interest === 'None',
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
            sx={{ minHeight: '100px' }}
            id='abstract'
          />
        </Field>
        <Field
          label='License'
          id='license'
          error={errors.license ?? errors.data_license}
        >
          <Licenses
            license={data.license}
            setLicense={setters.license}
            dataLicense={data.data_license}
            setDataLicense={setters.data_license}
            submissionType={data.submission_type}
          />
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

        <Field
          label='Comments to the editor'
          id='comments_editor'
          description='For most submissions, this is left blank.'
          error={errors.comments_editor}
        >
          <Textarea
            value={data.comments_editor}
            onChange={(e) => setters.comments_editor(e.target.value)}
            id='comments_editor'
          />
        </Field>

        <Field
          label='Conflict of interest statement'
          id='conflict_of_interest'
          description='If you have conflicts of interest to declare, please do so here and they will be displayed next to your submission. If not, check the no conflicts of interest box above.'
          error={errors.conflict_of_interest}
        >
          <Textarea
            value={data.conflict_of_interest}
            onChange={(e) => {
              setters.conflict_of_interest(e.target.value)
              if (e.target.value === 'None') {
                setHasConflict(true)
              } else {
                setHasConflict(false)
              }
            }}
            id='conflict_of_interest'
          />
          <Label
            sx={{
              cursor: 'pointer',
            }}
          >
            <Checkbox
              checked={hasConflict}
              onChange={(e) => {
                setHasConflict(e.target.checked)
                if (e.target.checked) {
                  setters.conflict_of_interest('None')
                } else {
                  setters.conflict_of_interest('')
                }
              }}
              sx={{ mt: '-1px' }}
            />
            No conflicts of interest to declare
          </Label>
        </Field>
      </Form>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionInformation
