'use client'

import { useState } from 'react'
import { Input, Label, Textarea } from 'theme-ui'
import {
  Checkbox,
  Field,
  Form,
  KeywordInput,
  Link,
} from '../../../../components'
import FundingSources from './funding-sources'
import NavButtons from '../../nav-buttons'
import Licenses from './licenses'
import Subjects from './subjects'
import { usePreprint } from '../../preprint-context'
import { useForm } from '../utils'
import { FormData, initializeForm, validateForm, submitForm } from './utils'

const SubmissionInformation = () => {
  const { preprint, setPreprint } = usePreprint()
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
          description='This should be the same as the article abstract or, for data-only submissions, a brief description of the dataset.'
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
          description={
            <>
              Pick an appropriate license for your{' '}
              {data.submission_type === 'Both' ? 'contents' : 'submission'}.
              Learn more about licensing{' '}
              <Link
                href='https://creativecommons.org/share-your-work/cclicenses/'
                sx={{ variant: 'text.mono' }}
              >
                here
              </Link>
              .
            </>
          }
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
          <Subjects value={data.subject} onChange={setters.subject} />
        </Field>
        <Field
          label='Keywords'
          id='keywords'
          description='Hit Enter to add a new keyword. Click on a keyword to remove it.'
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
          description='If you and/or your authorship team have conflicts of interest to declare, please do so here. If not, check the no conflicts of interest box above.'
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
